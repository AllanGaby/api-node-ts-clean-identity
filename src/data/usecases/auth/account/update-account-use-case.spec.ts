import { DbUpdateAccountUseCase } from './update-account-use-case'
import { DeleteSessionByAccountIdRepositorySpy, GetAccountByIdRepositorySpy, UpdateAccountRepositorySpy } from '@/data/tests/auth/account/mock-account-repository'
import { CacheRemoveByPrefixSpy, CacheRemoveSpy, mockUpdateAccountDTO, SendMailSessionSpy, throwError } from '@/data/tests'
import { HashComparerSpy, HashCreatorSpy } from '@/data/tests/mock-criptography'
import { SessionType } from '@/domain/models/auth'
import faker from 'faker'
import { InvalidCredentialsError } from '@/data/errors'

interface sutTypes {
  sut: DbUpdateAccountUseCase
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
  hashComparerSpy: HashComparerSpy
  hashCreatorSpy: HashCreatorSpy
  deleteSessionByAccountIdSpy: DeleteSessionByAccountIdRepositorySpy
  cacheRemoveByPrefixSpy: CacheRemoveByPrefixSpy
  updateAccountRepositorySpy: UpdateAccountRepositorySpy
  sendMailSessionSpy: SendMailSessionSpy
  mailFilePath: string
  cacheRemoveSpy: CacheRemoveSpy
}

const makeSut = (): sutTypes => {
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const hashComparerSpy = new HashComparerSpy()
  const hashCreatorSpy = new HashCreatorSpy()
  const deleteSessionByAccountIdSpy = new DeleteSessionByAccountIdRepositorySpy()
  const cacheRemoveByPrefixSpy = new CacheRemoveByPrefixSpy()
  const updateAccountRepositorySpy = new UpdateAccountRepositorySpy()
  const sendMailSessionSpy = new SendMailSessionSpy()
  const mailFilePath = faker.internet.url()
  const cacheRemoveSpy = new CacheRemoveSpy()
  const sut = new DbUpdateAccountUseCase(
    getAccountByIdRepositorySpy,
    hashComparerSpy,
    hashCreatorSpy,
    deleteSessionByAccountIdSpy,
    cacheRemoveByPrefixSpy,
    updateAccountRepositorySpy,
    sendMailSessionSpy,
    mailFilePath,
    cacheRemoveSpy)
  return {
    sut,
    getAccountByIdRepositorySpy,
    hashComparerSpy,
    hashCreatorSpy,
    updateAccountRepositorySpy,
    sendMailSessionSpy,
    mailFilePath,
    deleteSessionByAccountIdSpy,
    cacheRemoveByPrefixSpy,
    cacheRemoveSpy
  }
}

describe('DbUpdateAccountUseCase', () => {
  test('Should call GetAccountByIdRepostirory with correct values', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(getAccountByIdRepositorySpy.accountId).toBe(updateAccountDTO.id)
  })

  test('Should return null if GetAccountByIdRepostirory return null', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account = null
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if GetAccountByIdRepostirory throws', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    jest.spyOn(getAccountByIdRepositorySpy, 'getAccountById').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should not call HashComparer if not change password', async () => {
    const { sut, hashComparerSpy } = makeSut()
    const hashComparerSpyon = jest.spyOn(hashComparerSpy, 'compare')
    const updateAccountDTO = mockUpdateAccountDTO()
    delete updateAccountDTO.password
    await sut.update(updateAccountDTO)
    expect(hashComparerSpyon).not.toHaveBeenCalled()
  })

  test('Should not call HashComparer with correct values', async () => {
    const { sut, hashComparerSpy, getAccountByIdRepositorySpy } = makeSut()
    const hashComparerSpyon = jest.spyOn(hashComparerSpy, 'compare')
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(hashComparerSpyon).toHaveBeenCalledWith({
      payload: updateAccountDTO.password,
      hashedText: getAccountByIdRepositorySpy.account.password
    })
  })

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerSpy } = makeSut()
    jest.spyOn(hashComparerSpy, 'compare').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should return InvalidCredentialsError if HashComparer return false', async () => {
    const { sut, hashComparerSpy } = makeSut()
    hashComparerSpy.isValidHash = false
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrowError(InvalidCredentialsError)
  })

  test('Should not call HashCreator if not change password', async () => {
    const { sut, hashCreatorSpy, deleteSessionByAccountIdSpy } = makeSut()
    const createHashSpy = jest.spyOn(hashCreatorSpy, 'createHash')
    const deleteByAccountIdSpy = jest.spyOn(deleteSessionByAccountIdSpy, 'deleteByAccountId')
    const updateAccountDTO = mockUpdateAccountDTO()
    delete updateAccountDTO.newPassword
    await sut.update(updateAccountDTO)
    expect(createHashSpy).not.toBeCalled()
    expect(deleteByAccountIdSpy).not.toBeCalled()
  })

  test('Should throw if HashCreator throws', async () => {
    const { sut, hashCreatorSpy } = makeSut()
    jest.spyOn(hashCreatorSpy, 'createHash').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call HashCreator with correct values if change password', async () => {
    const { sut, hashCreatorSpy } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(hashCreatorSpy.payload).toBe(updateAccountDTO.newPassword)
  })

  test('Should call UpdateAccountRepository with correct values', async () => {
    const { sut, hashCreatorSpy, getAccountByIdRepositorySpy, updateAccountRepositorySpy } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(updateAccountRepositorySpy.params.id).toBe(getAccountByIdRepositorySpy.account.id)
    expect(updateAccountRepositorySpy.params.name).toBe(updateAccountDTO.name)
    expect(updateAccountRepositorySpy.params.email).toBe(updateAccountDTO.email)
    expect(updateAccountRepositorySpy.params.password).toBe(hashCreatorSpy.hash)
  })

  test('Should not update name if not change name', async () => {
    const { sut, hashCreatorSpy, getAccountByIdRepositorySpy, updateAccountRepositorySpy } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    delete updateAccountDTO.name
    await sut.update(updateAccountDTO)
    expect(updateAccountRepositorySpy.params.id).toBe(getAccountByIdRepositorySpy.account.id)
    expect(updateAccountRepositorySpy.params.name).toBe(getAccountByIdRepositorySpy.account.name)
    expect(updateAccountRepositorySpy.params.email).toBe(updateAccountDTO.email)
    expect(updateAccountRepositorySpy.params.password).toBe(hashCreatorSpy.hash)
  })

  test('Should throw if UpdateAccountRepository throws', async () => {
    const { sut, updateAccountRepositorySpy } = makeSut()
    jest.spyOn(updateAccountRepositorySpy, 'update').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call SendMailSession with correct values', async () => {
    const { sut, updateAccountRepositorySpy, sendMailSessionSpy, mailFilePath } = makeSut()
    await sut.update(mockUpdateAccountDTO())
    expect(sendMailSessionSpy.sendMailParams).toEqual({
      accountId: updateAccountRepositorySpy.account.id,
      name: updateAccountRepositorySpy.account.name,
      email: updateAccountRepositorySpy.account.email,
      subject: `[Identity] - ${updateAccountRepositorySpy.account.name}, sua conta foi alterada com sucesso`,
      mailFilePath,
      sessionType: SessionType.activeAccount
    })
  })

  test('Should return throw if SendMailSession throws', async () => {
    const { sut, sendMailSessionSpy } = makeSut()
    jest.spyOn(sendMailSessionSpy, 'sendMail').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should not call SendMailSession if not change mail', async () => {
    const { sut, sendMailSessionSpy } = makeSut()
    const sendMailSpy = jest.spyOn(sendMailSessionSpy, 'sendMail')
    const updateAccountDTO = mockUpdateAccountDTO()
    delete updateAccountDTO.email
    await sut.update(updateAccountDTO)
    expect(sendMailSpy).not.toBeCalled()
  })

  test('Should call CacheRemove with correct value', async () => {
    const { sut, cacheRemoveSpy, updateAccountRepositorySpy } = makeSut()
    await sut.update(mockUpdateAccountDTO())
    expect(cacheRemoveSpy.key).toBe(`account:${updateAccountRepositorySpy.account.email}`)
  })

  test('Should return throw if CacheRemove throws', async () => {
    const { sut, cacheRemoveSpy } = makeSut()
    jest.spyOn(cacheRemoveSpy, 'remove').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should not call DeleteSessionByAccountId and CacheRemoveByPrefix if not change password', async () => {
    const { sut, deleteSessionByAccountIdSpy, cacheRemoveByPrefixSpy } = makeSut()
    const deleteByAccountIdSpy = jest.spyOn(deleteSessionByAccountIdSpy, 'deleteByAccountId')
    const removeCacheByPrefixSpy = jest.spyOn(cacheRemoveByPrefixSpy, 'removeByPrefix')
    const updateAccountDTO = mockUpdateAccountDTO()
    delete updateAccountDTO.newPassword
    await sut.update(updateAccountDTO)
    expect(deleteByAccountIdSpy).not.toBeCalled()
    expect(removeCacheByPrefixSpy).not.toBeCalled()
  })

  test('Should call CacheRemoveByPrefix with correct value', async () => {
    const { sut, cacheRemoveByPrefixSpy } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(cacheRemoveByPrefixSpy.prefix).toBe(`session-authentication:${updateAccountDTO.id}`)
  })

  test('Should return throw if CacheRemoveByPrefix throws', async () => {
    const { sut, cacheRemoveByPrefixSpy } = makeSut()
    jest.spyOn(cacheRemoveByPrefixSpy, 'removeByPrefix').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call DeleteSessionByAccountId with correct value', async () => {
    const { sut, deleteSessionByAccountIdSpy } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(deleteSessionByAccountIdSpy.accountId).toEqual(updateAccountDTO.id)
  })

  test('Should return throw if DeleteSessionByAccountId throws', async () => {
    const { sut, deleteSessionByAccountIdSpy } = makeSut()
    jest.spyOn(deleteSessionByAccountIdSpy, 'deleteByAccountId').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })
})
