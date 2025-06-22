import { FileCard } from './FileCard'
import { useEffect, useState } from 'react'

export default function CardBuses() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        fetch('http://localhost:8000/agencias')
        .then(res => res.json())
        .then(data => setPosts(data))
    }, [])

    return (
        <div className="flex flex-wrap gap-10">
            {posts.map((post) => (
                <div className="w-[500px]">
                    <FileCard
                    key={post.id}
                    idCard={post.id}
                    title={post.nombre}
                    thumbnail={post.url_img}
                    />
                </div>
            )) 
            }
        </div>
    )
}