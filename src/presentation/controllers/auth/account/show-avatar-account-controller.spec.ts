import { ShowAvatarAccountBySessionController } from './show-avatar-account-controller'
import { GetFilenameToAccountAvatarSpy, mokeGetFilenameToAccountAvatar } from '@/presentation/test/auth'
import { serverError, ok } from '@/presentation/helpers'
import { throwError } from '@/data/test'
import faker from 'faker'
import path from 'path'

interface sutTypes {
  sut: ShowAvatarAccountBySessionController
  uploadDir: string
  getFilenameToAccountAvatarSpy: GetFilenameToAccountAvatarSpy
}

const makeSut = (): sutTypes => {
  const getFilenameToAccountAvatarSpy = new GetFilenameToAccountAvatarSpy()
  const uploadDir = faker.system.directoryPath()
  const sut = new ShowAvatarAccountBySessionController(getFilenameToAccountAvatarSpy, uploadDir)
  return {
    sut,
    getFilenameToAccountAvatarSpy,
    uploadDir
  }
}

describe('ShowAvatarAccountBySessionController', () => {
  test('Should call ShowAccount with correct values', async () => {
    const { sut, getFilenameToAccountAvatarSpy } = makeSut()
    const request = mokeGetFilenameToAccountAvatar()
    await sut.handle(request)
    expect(getFilenameToAccountAvatarSpy.params).toEqual({
      accountId: request.body.account.id
    })
  })

  test('Should return ServerError if ShowAccount throws', async () => {
    const { sut, getFilenameToAccountAvatarSpy } = makeSut()
    jest.spyOn(getFilenameToAccountAvatarSpy, 'getPath').mockImplementationOnce(throwError)
    const result = await sut.handle(mokeGetFilenameToAccountAvatar())
    expect(result).toEqual(serverError(new Error('')))
  })

  test('Should return ok and account avatar filename if succeeds', async () => {
    const { sut, getFilenameToAccountAvatarSpy, uploadDir } = makeSut()
    const result = await sut.handle(mokeGetFilenameToAccountAvatar())
    expect(result).toEqual(ok(`${uploadDir}${path.sep}${getFilenameToAccountAvatarSpy.avatarFilename}`))
  })
})
