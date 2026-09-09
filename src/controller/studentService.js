const axiosAPI = require("../controller/queryHelpers");
const {
    redisClient
} = require("../config/redisClient");
const redisCacheService = require('../cache/cacheService');


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

    return redisCacheService(
            `student:${id}`,
            120,
            () => axiosAPI.getStudentById(id)
        );
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