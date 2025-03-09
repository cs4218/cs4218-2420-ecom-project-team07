import { jest } from "@jest/globals";



export function mockRequest(body = {}) {
	return { body };
}

export function mockResponse() {
	return {
		json: jest.fn(),
		status: jest.fn().mockReturnThis(),
		send: jest.fn()
	};
}
