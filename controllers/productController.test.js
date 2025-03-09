
import { expect, jest } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import productModel from "../models/productModel.js";
import { mockRequest, mockResponse } from "../test-utils/mocks.js";
import { getProductController, getSingleProductController } from "./productController.js";



// babel-jest hoists mock calls so they run before the imports above!
jest.mock("../models/productModel.js", () => ({
	find: jest.fn().mockReturnThis(),
	findOne: jest.fn().mockReturnThis(),
	select: jest.fn().mockReturnThis(),
	populate: jest.fn().mockReturnThis(),
	sort: jest.fn().mockReturnThis(),
}));

describe("getProductController tests", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should successfully get all products", async () => {
		let req = mockRequest();
		let res = mockResponse();
		await getProductController(req, res);

		expect(productModel.find).toBeCalled();

		expect(res.status).toBeCalledWith(StatusCodes.OK);
		expect(res.send).toBeCalledWith(
			{ products: expect.anything() }
		);
	});

	it("should error when the model errors", async () => {
		productModel.find.mockImplementationOnce(() => {
			throw new Error();
		});

		let req = mockRequest();
		let res = mockResponse();
		await getProductController(req, res);

		expect(productModel.find).toBeCalled();

		expect(res.status).toBeCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(res.send).toBeCalledWith(
			{ message: expect.anything() }
		);
	});
});

describe("getSingleProductController tests", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should successfully get a specific product", async () => {
		let slug = "my-product-slug-name-success";
		let req = mockRequest(
			undefined,
			{ slug },
		);
		let res = mockResponse();
		await getSingleProductController(req, res);

		expect(productModel.findOne).toBeCalledWith(
			{ slug }
		);

		expect(res.status).toBeCalledWith(StatusCodes.OK);
		expect(res.send).toBeCalledWith(
			{ product: expect.anything() }
		);
	});

	it("should error when the model errors", async () => {
		productModel.findOne.mockImplementationOnce(() => {
			throw new Error();
		});

		let slug = "my-product-slug-name-error";
		let req = mockRequest(
			undefined,
			{ slug },
		);
		let res = mockResponse();
		await getSingleProductController(req, res);

		expect(productModel.findOne).toBeCalledWith(
			{ slug }
		);

		expect(res.status).toBeCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
		expect(res.send).toBeCalledWith(
			{ message: expect.anything() }
		);
	});
});
