import React, {useState} from 'react';
import './App.css';
import {Box, Button} from "@mui/material";
import {ContentForm} from "./ContentForm";
import {useOpenAIApiContext} from "./openai/OpenAIApiContext";
import {ChatCompletionResponseMessageRoleEnum} from "openai";
import {LoadingButton} from "@mui/lab";
import {HtmlRenderer} from "./ui/HtmlRenderer";

function Top() {
    const [isLoading, setIsLoading] = useState(false);
    const [contents, setContents] = useState(['']);
    const [answers, setAnswers] = useState<Array<string>>(['']);
    const openAiApiCtx = useOpenAIApiContext();

    const submitContents = () => {
        const post = async (content: string) => {
            if (!process.env.REACT_APP_OPENAI_MODEL) return;
            return openAiApiCtx?.createChatCompletion({
                model: process.env.REACT_APP_OPENAI_MODEL,
                messages: [
                    {
                        role: 'system',
                        content: 'あなたはコンピュータサイエンスに精通した翻訳家です。文章を日本語に翻訳してください。'
                    },
                    {
                        role: 'user',
                        content: content,
                    }
                ]
            });
        };
        const postAll = async () => {
            const responses = await Promise.all(contents.filter(x => x).map(x => post(x)));
            const newAnswers = responses?.flatMap(x => x?.data?.choices.filter(x => x?.message?.role === ChatCompletionResponseMessageRoleEnum.Assistant)
                .map(x => x?.message?.content ?? '') ?? []);
            setAnswers(newAnswers);
        }
        setIsLoading(true);
        postAll().finally(() => setIsLoading(false));
    };

    const addForm = () => {
        setContents([...contents, '']);
        setAnswers([...answers, '']);
    };

    const removeForm = (index: number) => {
        setContents([...contents.filter((_, i) => i !== index)]);
        setAnswers([...answers.filter((_, i) => i !== index)]);
    }

    const updateContent = (index: number, value: string) => {
        const newContents = contents.map((x, i) => {
            if (i !== index) return x;
            return value;
        });
        setContents(newContents);
    };

    const updateAnswer = (index: number, result: Array<string>) => {
        const newAnswers = [...answers];
        newAnswers[index] = result.join('\n').replaceAll('\n', '<br>');
        setAnswers(newAnswers);
    };

    const clearAnswers = () => {
        setContents(['']);
        setAnswers(['']);
    };

    const html = () =>
        answers
            .join('\n\n')
            .replaceAll('\n', '<br>');

    const contentForms = contents.map((x, i) => {
        return <ContentForm
            key={i}
            number={i}
            content={x}
            answer={answers[i]}
            updateContent={updateContent}
            updateAnswer={updateAnswer}
            removeForm={removeForm}
        />;
    });

    const copyAnswer = async () => {
        await navigator.clipboard.writeText(html().replaceAll('<br>', '\n'));
    };

    return (
        <div>
            <Box sx={{paddingY: 2}}>
                <div>ChatGPTで技術書を翻訳したい部</div>
            </Box>
            <Box sx={{paddingBottom: 2}}>
                <span style={{paddingRight: '1.5rem'}}>
                    <LoadingButton loading={isLoading} variant="outlined" onClick={submitContents}>
                        送信
                    </LoadingButton>
                </span>
                <span style={{paddingRight: '1.5rem'}}>
                    <Button variant="outlined" onClick={addForm}>
                        追加
                    </Button>
                </span>
                <span style={{paddingRight: '1.5rem'}}>
                    <Button variant="outlined" onClick={copyAnswer}>コピー</Button>
                </span>
                <span style={{paddingRight: '1.5rem'}}>
                    <Button variant="outlined" color='warning' onClick={clearAnswers}>
                        クリア
                    </Button>
                </span>
            </Box>
            <div>
                {contentForms}
            </div>
            <Box>
                <span style={{paddingBottom: '1rem'}}>
                    <HtmlRenderer raw_html={html()}/>
                </span>
            </Box>
        </div>
    );
}

export default Top;