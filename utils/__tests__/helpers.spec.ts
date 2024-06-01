import { NextApiResponse } from 'next'
import '@testing-library/jest-dom'
import { areUploadedFilesValid, validatePrompt } from '../helpers'
const mockResponse: NextApiResponse = {
  status: jest.fn(() => mockResponse),
  json: jest.fn(),
} as any
describe('Helper functions', () => {
  describe('validatePrompt', () => {
    it('should return null and set status 400 if prompt is empty', () => {
      validatePrompt('', mockResponse)
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: { message: 'Please enter a valid prompt' },
      })
    })

    it('should do nothing if prompt is not empty', () => {
      validatePrompt('Some prompt', mockResponse)
      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(mockResponse.json).not.toHaveBeenCalled()
    })
  })

  describe('areUploadedFilesValid', () => {
    it('should return true when uploadedFiles is empty', () => {
      const uploadedFiles: object[] = []
      const result = areUploadedFilesValid(uploadedFiles, mockResponse)
      expect(result).toBe(true)
    })

    it('should return true when uploaded files are valid', () => {
      const uploadedFiles = { file: [{ size: 1000 }] }
      const result = areUploadedFilesValid(uploadedFiles, mockResponse)
      expect(result).toBe(true)
    })

    it('should return false and send 400 status when file size is 0', () => {
      const uploadedFiles = { file: [{ size: 0 }] }
      const result = areUploadedFilesValid(uploadedFiles, mockResponse)
      expect(result).toBe(false)
      expect(mockResponse.status).toHaveBeenCalledWith(400)
    })

    it('should return false and send 400 status when file size exceeds 20MB', () => {
      const uploadedFiles = { file: [{ size: 2.1e7 }] }
      const result = areUploadedFilesValid(uploadedFiles, mockResponse)
      expect(result).toBe(false)
      expect(mockResponse.status).toHaveBeenCalledWith(400)
    })
  })
})
