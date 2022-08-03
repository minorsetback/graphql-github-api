import { gql } from "@apollo/client";


export const GET_ISSUES = gql`
    query($owner: String!, $name: String!) { 
        repository(owner: $owner, name: $name) { 
            issues(first: 100, states:OPEN) {
                nodes {
                    author {
                        login
                    }
                    body
                    comments(first: 100) {
                        nodes {
                        body
                        author {
                            ... on User {
                            login
                            }
                        }
                        }
                    }
                    id
                }
                
            }
        }
    }`

export const ADD_COMMENT = gql`
    mutation ($text: String!, $id: ID!){
        addComment(input:{ 
          subjectId: $id,
          body:$text
        }) {
          clientMutationId
        }
    }`