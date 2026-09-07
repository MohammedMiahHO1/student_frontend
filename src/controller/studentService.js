const axiosAPI = require("../controller/queryHelpers");
const {
    redisClient
} = require("../config/redisClient");


async function updateStudentSubject(
    studentId,
    studentSubjectId,
    subject,
    grade
) {

    const updatedStudentSubject = await axiosAPI.updateStudentSubject(
        studentSubjectId,
        subject,
        grade
    );
    await redisClient.del(`student:${studentId}`);

    return updatedStudentSubject;
}

async function getStudentById(id) {

    const cacheKey = `student:${id}`;

    const cachedStudent =
        await redisClient.get(cacheKey);

    if (cachedStudent) {

        console.log("STUDENT CACHE HIT");

        return JSON.parse(cachedStudent);
    }

    console.log("STUDENT CACHE MISS");

    const student =
        await axiosAPI.getStudentById(id);

    if (!student) {
        return null;
    }

    await redisClient.setEx(
        cacheKey,
        120,
        JSON.stringify(student)
    );

    return student;
}

async function getAllStudents() {
    const cacheKey = "students:all";


    const cachedStudents =
        await redisClient.get(cacheKey);

    if (cachedStudents) {

        console.log("CACHE HIT");

        return JSON.parse(cachedStudents);
    }

    console.log("CACHE MISS");


    const students =
        await axiosAPI.getAllStudents();


    await redisClient.setEx(
        cacheKey,
        240,
        JSON.stringify(students)
    );


    return students;


}

async function createStudentWithSubject({
                                            name,
                                            branch,
                                            percentage,
                                            subject,
                                            grade
                                        }) {


    const student = await  axiosAPI.createStudentWithSubject(
        name,
        percentage,
        branch,
        subject,
        grade
    );

    await redisClient.del("students:all");
    return student

}


module.exports = {
    createStudentWithSubject, getAllStudents,getStudentById, updateStudentSubject
};