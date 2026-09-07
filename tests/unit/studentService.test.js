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

    describe("GET student by id", ()=>{
        test("returns student by id cache hit", async () => {



            const student = [
                {
                    rollNo: 1,
                    name: "Ali",
                    percentage: 85.5,
                    branch: "Computer Science",
                    subject: "Maths",
                    grade: "88"
                }
            ];

            const studentId = student.rollNo;

            redisClient.get
                .mockResolvedValue(JSON.stringify(student));


            const result =
                await studentService.getStudentById(studentId);

            expect(redisClient.get).toHaveBeenCalledWith(`student:${studentId}`);

            expect(axiosAPI.getStudentById).not.toHaveBeenCalled();

            expect(result).toEqual(student);
        });
        test("returns student by id cache miss", async () => {



            const student = [
                {
                    rollNo: 1,
                    name: "Ali",
                    percentage: 85.5,
                    branch: "Computer Science",
                    subject: "Maths",
                    grade: "88"
                }
            ];

            const studentId = student.rollNo;

            redisClient.get
                .mockResolvedValue(null);

            axiosAPI.getStudentById
                .mockResolvedValue(student);

            const result =
                await studentService.getStudentById(studentId);

            expect(redisClient.get)
                .toHaveBeenCalledWith(`student:${studentId}`);

            expect(axiosAPI.getStudentById).toHaveBeenCalledWith(studentId);
            expect(redisClient.setEx)
                .toHaveBeenCalledWith(
                    `student:${studentId}`,
                    120,
                    JSON.stringify(student)
                );

            expect(result).toEqual(student);
        });

        test("throws error when Redis get fails", async () => {

            const studentId = 1;

            redisClient.get
                .mockRejectedValue(new Error("Redis unavailable"));

            await expect(
                studentService.getStudentById(studentId)
            ).rejects.toThrow("Redis unavailable");

            expect(axiosAPI.getStudentById)
                .not.toHaveBeenCalled();
        });

        test("throws error when API call fails", async () => {

            const studentId = 1;

            redisClient.get
                .mockResolvedValue(null);

            axiosAPI.getStudentById
                .mockRejectedValue(new Error("API unavailable"));

            await expect(
                studentService.getStudentById(studentId)
            ).rejects.toThrow("API unavailable");

            expect(redisClient.setEx)
                .not.toHaveBeenCalled();
        });
        test("returns null when student is not in cache or API", async () => {

            const studentId = 1;

            redisClient.get
                .mockResolvedValue(null);

            axiosAPI.getStudentById
                .mockResolvedValue(null);

            const result =
                await studentService.getStudentById(studentId);

            expect(redisClient.get)
                .toHaveBeenCalledWith(`student:${studentId}`);

            expect(axiosAPI.getStudentById)
                .toHaveBeenCalledWith(studentId);

            expect(redisClient.setEx)
                .not.toHaveBeenCalled();

            expect(result).toBeNull();
        });




    })

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