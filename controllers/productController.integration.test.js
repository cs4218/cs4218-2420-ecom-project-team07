import { expect, jest } from "@jest/globals";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import productModel from "../models/productModel.js";
import { mockRequest, mockResponse } from "../test-utils/mocks.js";
import { getSampleProducts } from "../test-utils/utils.js";
import { getProductController } from "./productController.js";



const SAMPLE_PRODUCTS = getSampleProducts();
beforeAll(async () => {
	await connectDB();

	// Clear all products
	console.log("Deleting all products...");
	await productModel.deleteMany({});
	console.log("Deleted!");

	// Insert sample products
	console.log("Inserting sample products...");
	await productModel.insertMany(SAMPLE_PRODUCTS);
	console.log("Inserted!");
});

beforeEach(() => {
	jest.clearAllMocks();
});

afterAll(async () => {
	await mongoose.connection.close();
});

describe("product controller + product model integration tests", () => {
	it("should successfully get all products", async () => {
		let req = mockRequest();
		let res = mockResponse();
		await getProductController(req, res);

		expect(res.status).toBeCalledWith(StatusCodes.OK);
		expect(res.send).toBeCalledWith({
			products: expect.any(Array)
		});
		expect(res.send.mock.calls[0][0].products).toHaveLength(SAMPLE_PRODUCTS.length);
	});
});

// describe("getSingleProductController tests", () => {
// 	it("should successfully get a specific product", async () => {
// 		let slug = "my-product-slug-name-success";
// 		let req = mockRequest(
// 			undefined,
// 			{ slug },
// 		);
// 		let res = mockResponse();
// 		await getSingleProductController(req, res);

// 		expect(productModel.findOne).toBeCalledWith(
// 			{ slug }
// 		);

// 		expect(res.status).toBeCalledWith(StatusCodes.OK);
// 		expect(res.send).toBeCalledWith(
// 			{ product: expect.anything() }
// 		);
// 	});

// 	it("should error when the model errors", async () => {
// 		productModel.findOne.mockImplementationOnce(() => {
// 			throw new Error();
// 		});

// 		let slug = "my-product-slug-name-error";
// 		let req = mockRequest(
// 			undefined,
// 			{ slug },
// 		);
// 		let res = mockResponse();
// 		await getSingleProductController(req, res);

// 		expect(productModel.findOne).toBeCalledWith(
// 			{ slug }
// 		);

// 		expect(res.status).toBeCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
// 		expect(res.send).toBeCalledWith(
// 			{ message: expect.anything() }
// 		);
// 	});
// });

// describe("productPhotoController tests", () => {
// 	it("should get the specified product's photo", async () => {
// 		let contentType = "image/jpeg";
// 		let data = "UklGRhSEAABXRUJQVlA4IAiEAABw6QGdASpYAo0CP";
// 		productModel.select.mockImplementationOnce(() => ({
// 			photo: { contentType, data }
// 		}));

// 		let id = "66db427fdb0119d9234b27f9";
// 		let req = mockRequest(
// 			undefined,
// 			{ pid: id },
// 		);
// 		let res = mockResponse();
// 		await productPhotoController(req, res);

// 		expect(productModel.findById).toBeCalledWith(id);
// 		expect(productModel.select).toBeCalled();

// 		expect(res.set).toBeCalledWith(expect.anything(), contentType);
// 		expect(res.status).toBeCalledWith(StatusCodes.OK);
// 		expect(res.send).toBeCalledWith(data);
// 	});

// 	it("should error when the model errors", async () => {
// 		productModel.findById.mockImplementationOnce(() => {
// 			throw new Error();
// 		});

// 		let id = "67a2171ea6d9e00ef2ac0229";
// 		let req = mockRequest(
// 			undefined,
// 			{ pid: id },
// 		);
// 		let res = mockResponse();
// 		await productPhotoController(req, res);

// 		expect(productModel.findById).toBeCalledWith(id);

// 		expect(res.status).toBeCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
// 		expect(res.send).toBeCalledWith(
// 			{ message: expect.anything() }
// 		);
// 	});

// 	it("should 404 when the product doesn't exist", async () => {
// 		productModel.select.mockImplementationOnce(() => null);

// 		let id = "invalid ID";
// 		let req = mockRequest(
// 			undefined,
// 			{ pid: id },
// 		);
// 		let res = mockResponse();
// 		await productPhotoController(req, res);

// 		expect(productModel.findById).toBeCalledWith(id);
// 		expect(productModel.select).toBeCalled();

// 		expect(res.status).toBeCalledWith(StatusCodes.NOT_FOUND);
// 		expect(res.send).toBeCalled();
// 	});

// 	it("should 204 when the product has no photo", async () => {
// 		productModel.select.mockImplementationOnce(() => ({
// 			photo: {
// 				contentType: "",
// 				data: undefined,
// 			}
// 		}));

// 		let id = "61a21772a6d9e00ef2ac022a";
// 		let req = mockRequest(
// 			undefined,
// 			{ pid: id },
// 		);
// 		let res = mockResponse();
// 		await productPhotoController(req, res);

// 		expect(productModel.findById).toBeCalledWith(id);
// 		expect(productModel.select).toBeCalled();

// 		expect(res.status).toBeCalledWith(StatusCodes.NO_CONTENT);
// 		expect(res.send).toBeCalled();
// 	});
// });

// describe("productCountController tests", () => {
// 	it("should successfully count all products", async () => {
// 		let count = 7050;
// 		productModel.estimatedDocumentCount.mockImplementationOnce(() => count);

// 		let req = mockRequest();
// 		let res = mockResponse();
// 		await productCountController(req, res);

// 		expect(productModel.find).toBeCalled();
// 		expect(productModel.estimatedDocumentCount).toBeCalled();

// 		expect(res.status).toBeCalledWith(StatusCodes.OK);
// 		expect(res.send).toBeCalledWith(
// 			{ total: count }
// 		);
// 	});

// 	it("should error when the model errors", async () => {
// 		productModel.find.mockImplementationOnce(() => {
// 			throw new Error();
// 		});

// 		let req = mockRequest();
// 		let res = mockResponse();
// 		await productCountController(req, res);

// 		expect(productModel.find).toBeCalled();

// 		expect(res.status).toBeCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
// 		expect(res.send).toBeCalledWith(
// 			{ message: expect.anything() }
// 		);
// 	});
// });
