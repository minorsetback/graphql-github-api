import { useQuery, gql, useMutation } from "@apollo/client";
import Accordion from 'react-bootstrap/Accordion';
import 'bootstrap/dist/css/bootstrap.min.css';

const GET_ISSUES = gql`
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

const ADD_COMMENT = gql`
    mutation ($text: String!, $id: ID!){
        addComment(input:{ 
          subjectId: $id,
          body:$text
        }) {
          clientMutationId
        }
    }`

function List({ link }) {
    const repo = link.split('/')
    let owner = repo[3]
    let name = repo[4]
    let input;

    const { data, loading, error } = useQuery(GET_ISSUES, { variables: { owner, name } });

    const [addComment, { loading: mutationLoading, error: mutationError }] = useMutation(ADD_COMMENT, {
        refetchQueries: [
            {
                query: GET_ISSUES,
                variables: { owner, name }
            }
        ],
        awaitRefetchQueries: true,
    });

    if (loading) {
        return <div>loading</div>;
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    return (
        <Accordion defaultActiveKey="0">
            {
                data?.repository.issues.nodes.map((item, index) => {
                    return (
                        <Accordion.Item key={index} eventKey={index}>
                            <Accordion.Header >
                                <div className="ms-2">
                                    <div className="fw-bold">{item.author.login}</div>
                                    {item.body}
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                {item.comments.nodes.map((item, index) => {
                                    return (
                                        <div className="ms-2" key={index}>
                                            <div className="fw-bold">{item.author.login}</div>
                                            {item.body}
                                        </div>)
                                })}
                                <span className="ms-2" style={{ display: mutationLoading ? "block" : "none" }}>Submitting...</span>
                                <span className="ms-2" style={{ display: mutationError ? "block" : "none" }}>{`Submission error! ${mutationError?.message}`}</span>

                                <form className="ms-2" style={{ display: mutationLoading ? "none" : "block" }}
                                    onSubmit={e => {
                                        e.preventDefault();
                                        addComment({ variables: { text: input.value, id: item.id } }).catch(err => {
                                            console.log('Oh noooo!!');
                                        });
                                        input.value = '';
                                    }}
                                >
                                    <input
                                        ref={node => {
                                            input = node;
                                        }}
                                        className="commentInput"
                                    />
                                    <button type="submit" className='submit'>Submit</button>
                                </form>
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                })}
        </Accordion>
    )
}


export default List;
