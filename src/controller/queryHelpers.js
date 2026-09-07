const axios = require("axios");
require('dotenv').config();

const JAVA_API_URL = "http://localhost:8080/graphql";



async function updateStudentSubject(
    studentSubjectId,
    subject,
    grade
) {

    const query = `
        mutation UpdateStudentSubject(
            $studentSubjectId: ID!,
            $subject: String!,
            $grade: Float!
        ) {
            updateStudentSubject(
                studentSubjectId: $studentSubjectId,
                subject: $subject,
                grade: $grade
            ) {
                id
                grade
                subject {
                    id
                    name
                }
            }
        }
    `;

    const variables = {
        studentSubjectId,
        subject,
        grade
    };

    const response =
        await axios.post(
            JAVA_API_URL,
            {
                query,
                variables
            }
        );

    if (response.data.errors) {
        throw new Error(
            response.data.errors[0].message
        );
    }

    return response.data.data.updateStudentSubject;
}

async function getAllStudents() {


    const query = `
    query {
      getAllStudents {
        rollNo
        name
        percentage
        branch
        subjects {
          id
          grade
          subject {
            id
            name
          }
        }
      }
    }
  `;

    const response = await axios.post(JAVA_API_URL, {
        query
    });

    if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
    }

    return response.data.data.getAllStudents;

}


async function createStudentWithSubject(
    name,
    percentage,
    branch,
    subject,
    grade
) {

    const mutation = `
        mutation CreateStudentWithSubject(
            $name: String!
            $percentage: Float!
            $branch: String!
            $subject: String!
            $grade: Float!
        ) {
            createStudentWithSubject(
                name: $name
                percentage: $percentage
                branch: $branch
                subject: $subject
                grade: $grade
            ) {
                rollNo
                name
                percentage
                branch
                subjects {
                    id
                    grade
                    subject {
                        id
                        name
                    }
                }
            }
        }
    `;

    const response = await axios.post(JAVA_API_URL, {
        query: mutation,
        variables: {
            name,
            percentage,
            branch,
            subject,
            grade
        }
    });

    if (response.data.errors) {
        throw new Error(
            response.data.errors[0].message
        );
    }

    return response.data.data.createStudentWithSubject;
}

async function getStudentById(id) {

    const query = `
        query GetStudentById($id: ID!) {
            getStudentById(id: $id) {
                rollNo
                name
                percentage
                branch
                subjects {
                    id
                    grade
                    subject {
                        id
                        name
                    }
                }
            }
        }
    `;

    const response = await axios.post(
        JAVA_API_URL,
        {
            query,
            variables: {
                id
            }
        }
    );

    if (response.data.errors) {
        throw new Error(
            response.data.errors[0].message
        );
    }

    return response.data.data.getStudentById;
}

module.exports = {
    createStudentWithSubject, getAllStudents, getStudentById,updateStudentSubject
}