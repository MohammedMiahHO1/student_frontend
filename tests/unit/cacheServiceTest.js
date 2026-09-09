const {
    redisClient
} = require("../../src/config/redisClient");

const {
    cacheService
} = require("../../src/cache/cacheService");

jest.mock("../../src/config/redisClient");

describe("cacheService", () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe("get student by id cache service",()=>{


    test("returns cached data on cache hit", async () => {

        const student = {
            rollNo: 1,
            name: "Ali",
            percentage: 85.5,
            branch: "Computer Science"
        };

        redisClient.get.mockResolvedValue(
            JSON.stringify(student)
        );

        const fetchFunction = jest.fn();

        const result = await cacheService(
            "student:1",
            120,
            fetchFunction
        );

        expect(redisClient.get)
            .toHaveBeenCalledWith("student:1");

        expect(fetchFunction)
            .not.toHaveBeenCalled();

        expect(redisClient.setEx)
            .not.toHaveBeenCalled();

        expect(result).toEqual(student);
    });

    test("fetches and caches data on cache miss", async () => {

        const student = {
            rollNo: 1,
            name: "Ali",
            percentage: 85.5,
            branch: "Computer Science"
        };

        // Nothing in Redis
        redisClient.get.mockResolvedValue(null);

        // Simulates getting data from the API
        const fetchFunction = jest.fn()
            .mockResolvedValue(student);

        const result = await cacheService(
            "student:1",
            120,
            fetchFunction
        );

        expect(redisClient.get)
            .toHaveBeenCalledWith("student:1");

        expect(fetchFunction)
            .toHaveBeenCalledTimes(1);

        expect(redisClient.setEx)
            .toHaveBeenCalledWith(
                "student:1",
                120,
                JSON.stringify(student)
            );

        expect(result).toEqual(student);
    });

    test("throws error when Redis get fails", async () => {

        redisClient.get
            .mockRejectedValue(
                new Error("Redis unavailable")
            );

        const fetchFunction = jest.fn();

        await expect(
            cacheService(
                "student:1",
                120,
                fetchFunction
            )
        ).rejects.toThrow(
            "Redis unavailable"
        );

        expect(
            redisClient.get
        ).toHaveBeenCalledWith(
            "student:1"
        );

        expect(
            fetchFunction
        ).not.toHaveBeenCalled();
    });

    test("throws error when fetch function fails", async () => {

        redisClient.get
            .mockResolvedValue(null);

        const fetchFunction =
            jest.fn()
                .mockRejectedValue(
                    new Error("API unavailable")
                );

        await expect(
            cacheService(
                "student:1",
                120,
                fetchFunction
            )
        ).rejects.toThrow(
            "API unavailable"
        );

        expect(
            redisClient.setEx
        ).not.toHaveBeenCalled();
    });

    test("returns null when fetch function returns null", async () => {

        redisClient.get
            .mockResolvedValue(null);

        const fetchFunction =
            jest.fn()
                .mockResolvedValue(null);

        const result =
            await cacheService(
                "student:1",
                120,
                fetchFunction
            );

        expect(
            redisClient.get
        ).toHaveBeenCalledWith(
            "student:1"
        );

        expect(
            fetchFunction
        ).toHaveBeenCalledTimes(1);

        expect(
            redisClient.setEx
        ).not.toHaveBeenCalled();

        expect(result).toBeNull();
    });
    })


});