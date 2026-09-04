const axiosAPI =
    require("../../src/controller/queryHelpers");

const studentService =
    require("../../src/controller/studentService");

jest.mock("../../src/controller/queryHelpers");
const {
    redisClient
} = require("../../src/config/redisClient");

jest.mock("../../src/config/redisClient");

describe("studentService", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllStudents", () => {

        test("returns all students", async () => {

            const students = [
                {
                    rollNo: 1,
                    name: "Ali",
                    percentage: 85.5,
                    branch: "Computer Science"
                }
            ];
            redisClient.get
                .mockResolvedValue(null);

            axiosAPI.getAllStudents
                .mockResolvedValue(students);

            const result =
                await studentService.getAllStudents();

            expect(
                redisClient.get
            ).toHaveBeenCalledWith(
                "students:all"
            );

            expect(
                axiosAPI.getAllStudents
            ).toHaveBeenCalledTimes(1);

            expect(result).toEqual(students);
        });
        test("stores students in Redis after cache miss", async () => {

            const students = [
                {
                    rollNo: 1,
                    name: "Ali",
                    percentage: 85.5,
                    branch: "Computer Science"
                }
            ];

            redisClient.get
                .mockResolvedValue(null);

            axiosAPI.getAllStudents
                .mockResolvedValue(students);

            await studentService.getAllStudents();

            expect(
                redisClient.setEx
            ).toHaveBeenCalledWith(
                "students:all",
                240,
                JSON.stringify(students)
            );
        });
        test("returns students from Redis when cache exists", async () => {

            const students = [
                {
                    rollNo: 1,
                    name: "Ali",
                    percentage: 85.5,
                    branch: "Computer Science"
                }
            ];

            redisClient.get
                .mockResolvedValue(
                    JSON.stringify(students)
                );

            const result =
                await studentService.getAllStudents();

            expect(result)
                .toEqual(students);

            expect(
                axiosAPI.getAllStudents
            ).not.toHaveBeenCalled();

            expect(
                redisClient.setEx
            ).not.toHaveBeenCalled();
        });
    });


    describe("createStudentWithSubject", () => {

        test("creates student with subject  and clears students cache", async () => {

            const createdStudent = {
                rollNo: 1,
                name: "Ali",
                percentage: 85.5,
                branch: "Computer Science"
            };

            axiosAPI.createStudentWithSubject
                .mockResolvedValue(createdStudent);

            const result =
                await studentService.createStudentWithSubject({
                    name: "Ali",
                    branch: "Computer Science",
                    percentage: 85.5,
                    subject: "Maths",
                    grade: 90
                });

            expect(
                axiosAPI.createStudentWithSubject
            ).toHaveBeenCalledWith(
                "Ali",
                85.5,
                "Computer Science",
                "Maths",
                90
            );
            expect(
                redisClient.del
            ).toHaveBeenCalledWith(
                "students:all"
            );

            expect(result).toEqual(createdStudent);
        });
        test("does not clear cache when student creation fails", async () => {

            axiosAPI.createStudentWithSubject
                .mockRejectedValue(
                    new Error("Unable to create student")
                );

            await expect(
                studentService.createStudentWithSubject({
                    name: "Ali",
                    branch: "Computer Science",
                    percentage: 85.5,
                    subject: "Maths",
                    grade: 90
                })
            ).rejects.toThrow(
                "Unable to create student"
            );

            expect(
                redisClient.del
            ).not.toHaveBeenCalled();
        });
    });
});