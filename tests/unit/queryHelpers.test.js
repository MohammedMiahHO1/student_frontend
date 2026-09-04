const axios = require("axios");

const queryHelpers =
    require("../../src/controller/queryHelpers");

jest.mock("axios");



describe("query api calls to graphql", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("getAllStudents returns students", async () => {

        const students = [
            {
                rollNo: 1,
                name: "Ali",
                percentage: 85.5,
                branch: "Computer Science",
                subjects: [
                    {
                        id: 1,
                        grade: 90,
                        subject: {
                            id: 1,
                            name: "Maths"
                        }
                    }
                ]
            }
        ];

        axios.post.mockResolvedValue({
            data: {
                data: {
                    getAllStudents: students
                }
            }
        });

        const result =
            await queryHelpers.getAllStudents();

        expect(result).toEqual(students);

        expect(
            axios.post
        ).toHaveBeenCalledTimes(1);
    });

    test("getAllStudents returns empty array when no students exist", async () => {

        axios.post.mockResolvedValue({
            data: {
                data: {
                    getAllStudents: []
                }
            }
        });

        const result =
            await queryHelpers.getAllStudents();

        expect(result).toEqual([]);
    });

    test("throws error when GraphQL returns an error get all students", async () => {

        axios.post.mockResolvedValue({
            data: {
                errors: [
                    {
                        message:
                            "Unable to retrieve students"
                    }
                ]
            }
        });

        await expect(
            queryHelpers.getAllStudents()
        ).rejects.toThrow(
            "Unable to retrieve students"
        );
    });

    test("returns student with subjects details", async () => {

        const createdStudent = {
            rollNo: 1,
            name: "Ali",
            percentage: 85.5,
            branch: "Computer Science"
        };

        axios.post.mockResolvedValue({
            data: {
                data: {
                    createStudentWithSubject:
                    createdStudent
                }
            }
        });

        const result =
            await queryHelpers
                .createStudentWithSubject(
                    "Ali",
                    85.5,
                    "Computer Science",
                    "Maths",
                    90
                );

        expect(result)
            .toEqual(createdStudent);
    });
    test("throws error when axios request fails create subject with student", async () => {

        axios.post.mockRejectedValue(
            new Error("Network Error")
        );

        await expect(
            queryHelpers
                .createStudentWithSubject(
                    "Ali",
                    85.5,
                    "Computer Science",
                    "Maths",
                    90
                )
        ).rejects.toThrow(
            "Network Error"
        );
    });
    test("getAllStudents throws error when axios request fails", async () => {

        axios.post.mockRejectedValue(
            new Error("Network Error")
        );

        await expect(
            queryHelpers.getAllStudents()
        ).rejects.toThrow(
            "Network Error"
        );
    });

    test("throws error when GraphQL returns an error for create student with subjects", async () => {

        axios.post.mockResolvedValue({
            data: {
                errors: [
                    {
                        message: "Unable to create student"
                    }
                ]
            }
        });

        await expect(
            queryHelpers.createStudentWithSubject(
                "Ali",
                85.5,
                "Computer Science",
                "Maths",
                90
            )
        ).rejects.toThrow(
            "Unable to create student"
        );
    });

});