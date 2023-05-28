type HtmlRendererProps = {
    raw_html: string
}

export const HtmlRenderer = (props: HtmlRendererProps) => {
    return (
        <div dangerouslySetInnerHTML={{__html: props.raw_html}} />
    )
}