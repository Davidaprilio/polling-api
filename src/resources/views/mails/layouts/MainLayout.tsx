export default function MainLayout(props: {hello: string, data: string[]}) {
    return (
        <main>
            Hello {props.hello}
            <ul>
                {props.data.map(a => <li>{a}</li>)}
            </ul>
        </main>
    )
};
