const axiosAPI =
    require("../../src/controller/queryHelpers");

const studentService =
    require("../../src/controller/studentService");
const {cacheService,deleteCache} =
    require("../../src/cache/cacheService");

const {
    redisClient
} = require("../../src/config/redisClient");


jest.mock("../../src/controller/queryHelpers");
jest.mock("../../src/cache/cacheService");
jest.mock("../../src/config/redisClient");

describe("studentService", () => {

    beforeEach(() => {

        jest.resetAllMocks();
    });

    describe("GET student by id", ()=>{
        test("returns student by id cache hit", async () => {



            const student =
                {
                    rollNo: 1,
                    name: "Ali",
                    percentage: 85.5,
                    branch: "Computer Science",
                    subject: "Maths",
                    grade: "88"
                }


            const studentId = student.rollNo;



            cacheService.mockResolvedValue(student)


            const result =
                await studentService.getStudentById(studentId);



            expect(
                cacheService
            ).toHaveBeenCalledWith(
                `student:${studentId}`,
                120,
                expect.any(Function)
            );

            expect(result).toEqual(student);
        });




    })

    describe("getAllStudents", () => {

        test("returns all students", async () => {

            const students =
                [{
                    rollNo: 1,
                    name: "Ali",
                    percentage: 85.5,
                    branch: "Computer Science"
                }];


            cacheService.mockResolvedValue(students)
            const result =
                await studentService.getAllStudents();

            expect(result).toEqual(students);
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
            deleteCache.mockResolvedValue();

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
                deleteCache
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
