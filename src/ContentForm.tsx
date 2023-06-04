import React from 'react';
import {Box, Button} from "@mui/material";
import {Textarea} from "@mui/joy";

type ContentFormProps = {
    number: number,
    content: string,
    answer: string,
    updateContent: (id: number, enteredContent: string) => void,
    updateAnswer: (id: number, result: Array<string>) => void,
    removeForm: (id: number) => void,
}

export const ContentForm = (props: ContentFormProps) => {
    const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.updateContent(props.number, e.target.value);
    };

    const onClickRemoveButton = () => {
        props.removeForm(props.number);
    };

    return (
        <>
            <Box sx={{paddingBottom: 2}}>
                <Textarea
                    placeholder={'内容'}
                    minRows={5}
                    onChange={onChange}
                    value={props.content}
                />
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingBottom: 2,
                }}>
                <span style={{paddingLeft: '0.5rem'}}>
                    <Button color='error' variant='outlined' onClick={onClickRemoveButton}>削除</Button>
                </span>
            </Box>
        </>
    );
}