import { NextApiResponse, NextApiRequest } from 'next'
import formidable from 'formidable'
import '@testing-library/jest-dom'
import {
  validatePrompt,
  isUploadedFileValid,
} from '../helpers'

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

  describe('isUploadedFileValid', () => {
    it('should return false and set status 400 if no file is uploaded', () => {
      isUploadedFileValid([], mockResponse)
      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: { message: 'Please upload a valid file' },
      })
    })

    it('should return false and set status 400 if uploaded file is invalid', () => {
      const uploadedFile: formidable.File[] = [{ size: 0 } as any];
    const result = isUploadedFileValid(uploadedFile, mockResponse);
    console.log({result})
    expect(result).toBe(false);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    })

    it('should return true if uploaded file is valid', () => {
      const result = isUploadedFileValid([{ size: 100 } as any], mockResponse)
      expect(result).toBe(true)
      expect(mockResponse.status).not.toHaveBeenCalled()
      expect(mockResponse.json).not.toHaveBeenCalled()
    })
  })
})