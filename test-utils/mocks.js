import { jest } from "@jest/globals";



export function mockRequest(body = {}, params = {}) {
	return { body, params };
}

export function mockResponse() {
	return {
		set: jest.fn(),
		json: jest.fn(),
		status: jest.fn().mockReturnThis(),
		send: jest.fn()
	};
}
