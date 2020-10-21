import { DbUpdateAccount } from './update-account'
import { GetAccountByIdRepositorySpy, UpdateAccountRepositorySpy } from '@/data/test/auth/mock-account-repository'
import { mockUpdateAccountDTO, SendMailActiveAccountSpy, throwError, UploadFileSpy } from '@/data/test'
import { HashCreatorSpy } from '@/data/test/mock-criptography'
import faker from 'faker'
import path from 'path'

interface sutTypes {
  sut: DbUpdateAccount
  getAccountByIdRepositorySpy: GetAccountByIdRepositorySpy
  hashCreatorSpy: HashCreatorSpy
  updateAccountRepositorySpy: UpdateAccountRepositorySpy
  sendMailActiveAccountSpy: SendMailActiveAccountSpy
  mailFilePath: string
  uploadFileSpy: UploadFileSpy
  destinationFileDir: string
}

const makeSut = (): sutTypes => {
  const hashCreatorSpy = new HashCreatorSpy()
  const getAccountByIdRepositorySpy = new GetAccountByIdRepositorySpy()
  const updateAccountRepositorySpy = new UpdateAccountRepositorySpy()
  const sendMailActiveAccountSpy = new SendMailActiveAccountSpy()
  const mailFilePath = faker.internet.url()
  const uploadFileSpy = new UploadFileSpy()
  const destinationFileDir = faker.internet.url()
  const sut = new DbUpdateAccount(
    getAccountByIdRepositorySpy,
    hashCreatorSpy,
    updateAccountRepositorySpy,
    sendMailActiveAccountSpy,
    mailFilePath,
    uploadFileSpy,
    destinationFileDir)
  return {
    sut,
    getAccountByIdRepositorySpy,
    hashCreatorSpy,
    updateAccountRepositorySpy,
    sendMailActiveAccountSpy,
    mailFilePath,
    uploadFileSpy,
    destinationFileDir
  }
}

describe('DbUpdateAccount', () => {
  test('Should call GetAccountByIdRepostirory with correct values', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(getAccountByIdRepositorySpy.accountId).toBe(updateAccountDTO.id)
  })

  test('Should return null if GetAccountByIdRepostirory return null', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    getAccountByIdRepositorySpy.account = null
    const account = await sut.update(mockUpdateAccountDTO())
    expect(account).toBeFalsy()
  })

  test('Should throw if GetAccountByIdRepostirory throws', async () => {
    const { sut, getAccountByIdRepositorySpy } = makeSut()
    jest.spyOn(getAccountByIdRepositorySpy, 'getAccountById').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should not call HashCreator if not change password', async () => {
    const { sut, hashCreatorSpy } = makeSut()
    const createHashSpy = jest.spyOn(hashCreatorSpy, 'createHash')
    const updateAccountDTO = mockUpdateAccountDTO()
    delete updateAccountDTO.password
    await sut.update(updateAccountDTO)
    expect(createHashSpy).not.toBeCalled()
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
    expect(hashCreatorSpy.payload).toBe(updateAccountDTO.password)
  })

  test('Should call UpdateAccountRepository with correct values', async () => {
    const { sut, hashCreatorSpy, getAccountByIdRepositorySpy, updateAccountRepositorySpy } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    expect(updateAccountRepositorySpy.account.id).toBe(getAccountByIdRepositorySpy.account.id)
    expect(updateAccountRepositorySpy.account.name).toBe(updateAccountDTO.name)
    expect(updateAccountRepositorySpy.account.email).toBe(updateAccountDTO.email)
    expect(updateAccountRepositorySpy.account.password).toBe(hashCreatorSpy.hash)
  })

  test('Should throw if UpdateAccountRepository throws', async () => {
    const { sut, updateAccountRepositorySpy } = makeSut()
    jest.spyOn(updateAccountRepositorySpy, 'update').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should call SendMailActiveAccount with correct values', async () => {
    const { sut, updateAccountRepositorySpy, sendMailActiveAccountSpy, mailFilePath } = makeSut()
    await sut.update(mockUpdateAccountDTO())
    expect(sendMailActiveAccountSpy.sendMailParams).toEqual({
      accountId: updateAccountRepositorySpy.account.id,
      name: updateAccountRepositorySpy.account.name,
      email: updateAccountRepositorySpy.account.email,
      subject: `[Identity] - ${updateAccountRepositorySpy.account.name}, sua conta foi alterada com sucesso`,
      mailFilePath
    })
  })

  test('Should return throw if SendMailActiveAccount throws', async () => {
    const { sut, sendMailActiveAccountSpy } = makeSut()
    jest.spyOn(sendMailActiveAccountSpy, 'sendMail').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should not call SendMailActiveAccount if not change mail', async () => {
    const { sut, sendMailActiveAccountSpy } = makeSut()
    const sendMailSpy = jest.spyOn(sendMailActiveAccountSpy, 'sendMail')
    const updateAccountDTO = mockUpdateAccountDTO()
    delete updateAccountDTO.email
    await sut.update(updateAccountDTO)
    expect(sendMailSpy).not.toBeCalled()
  })

  test('Should call UploadFile if change AvatarFile', async () => {
    const { sut, uploadFileSpy, destinationFileDir } = makeSut()
    const updateAccountDTO = mockUpdateAccountDTO()
    await sut.update(updateAccountDTO)
    const extFile = path.extname(updateAccountDTO.avatarFilePath)
    expect(uploadFileSpy.uploadParams).toEqual({
      sourceFilePath: updateAccountDTO.avatarFilePath,
      destinationFilePath: `${destinationFileDir}${path.sep}${updateAccountDTO.id}${extFile}`
    })
  })

  test('Should return throw if UploadFile throws', async () => {
    const { sut, uploadFileSpy } = makeSut()
    jest.spyOn(uploadFileSpy, 'upload').mockImplementationOnce(throwError)
    const promise = sut.update(mockUpdateAccountDTO())
    await expect(promise).rejects.toThrow()
  })

  test('Should not call UploadFile if not change AvatarFile', async () => {
    const { sut, uploadFileSpy } = makeSut()
    const uploadSpy = jest.spyOn(uploadFileSpy, 'upload')
    const updateAccountDTO = mockUpdateAccountDTO()
    delete updateAccountDTO.avatarFilePath
    await sut.update(updateAccountDTO)
    expect(uploadSpy).not.toBeCalled()
  })
})
