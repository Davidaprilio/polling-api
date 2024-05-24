import MainApp from "@/resources/views/mails/layouts/main";
import { Hono } from "hono";

const homeRoute = new Hono()

homeRoute.get('/', (c) => {
    const data = ['a', 'b', 'c']
    return c.html(
        <div>
            <h1>Hello Word</h1>
            <ul>
                {data.map(a => (
                    <li>{a}</li>
                ))}

            </ul>

            <MainApp  hello="Test" data={[
                'A', 'B', 'C'
            ]}/>
        </div>
    )
})

export default homeRoute