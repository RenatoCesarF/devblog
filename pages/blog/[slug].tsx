import fs from 'fs';
import path from 'path';
import matter  from 'gray-matter';
import Post from '../../classes/postType';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/router';

import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {darcula,a11yDark,atomDark,dracula} from 'react-syntax-highlighter/dist/cjs/styles/prism';

import CustomButton, {ButtonIcon} from '../../components/CustomButton';
import globalStyles from '../../styles/post.styles';
import Head from 'next/head';
import getImageType from '../../utils/getImageType';

interface IPost{post: Post};
type Params = {slug: string};
type StaticResponse = {params: Params};


const getCodeTheme = (name: string) => {
    if(name === null || name === undefined){
        return dracula;
    }
    switch (name) {
        case 'darcula':
            return darcula;
        case 'dracula':
            return dracula;
        case 'a11yDark':
            return a11yDark;
        case 'atomDark':
            return atomDark;
        default:
            return dracula;
    }
}

const PostPage: React.FC<IPost> = ({post}: IPost) => {
    const router = useRouter()
    const hasCoverImage:boolean = post.cover_image != undefined || post.cover_image != null;
    const codeTheme: string = getCodeTheme(post.code_theme);
    const imageType = getImageType(post.cover_image);

    return(
        <>
            <Head>
                <meta name="description" content={post.excerpt}/>
                <meta name="author" content={post.author.name}/>
                <meta name="keywords" content="Indie Games, Development, Game, Indie, Developers, Blog"/>
                {/* Fazer um map aqui com todas as categorias do post e adicionar como keyword */}
                <meta name="robots" content="index, follow"/>
                <meta name="googlebot" content="idnex, follow"/>

                <meta property="og:type" content="blog"/>
                <meta property="og:url" content={`https://devblog-nine.vercel.app/blog/${post.slug}`} />
                <meta property="og:title" content={post.title}/>
                <meta property="og:description" content={post.excerpt}/>
                <meta property="og:image" content={`${post.cover_image}`}/>
                <meta property="og:image:type" content={`image/${imageType}`} />
                {/* <meta property="og:image:width" content="800"/> 
                <meta property="og:image:height" content="600"/>  */}
                <meta property="og:image:alt" content="Post cover image"/> 
                
                <meta property="blog:title" content={post.title}/>
                <meta property="blog:author" content={post.author.name}/>
                <meta property="blog:section" content="Tutoriais"/>
                <meta property="blog:tag" content=""/>
                {/* Fazer um map aqui com todas as categorias do post e adicionar como tags */}
                <meta property="blog:published_time" content={post.date}/>

                <meta name="twitter:url" content={`https://devblog-nine.vercel.app/blog/${post.slug}`}/>
                <meta name="twitter:title" content={post.title}/>
                <meta name="twitter:description" content={post.excerpt}/>
                <meta name="twitter:image"content={`${post.cover_image}`}/>
            </Head>
            <style jsx global>
            {globalStyles}
            </style>
            <section className='post-section'>
                <div className='post-container'>
                <CustomButton text='' icon={ButtonIcon.arrowBack} onClick={() => {router.back()}}/>

                    {
                        hasCoverImage ? 
                        (<img  alt='blog post cover' className='post-cover'src={post.cover_image}/>)
                        : 
                        (
                            <div className='post-cover-div'>        
                                <h1 className='post-cover-date'>{post.date}</h1>
                            </div>
                        )
                    }   
                    <h1 className='post-title'>{post.title}</h1>
                    <br/>
                    <div className='post-content'>
                    
                    <ReactMarkdown
                        skipHtml={false}
                        components={{
                            img({node, className, children, ...props}){
                                return <img alt='blog post inside image' className='img-fit' src={props.src} ></img>
                            },
                            code({node, inline, className, children, ...props}) {
                                const match = /language-(\w+)/.exec(className || '')
                                return !inline && match ? (
                                    <SyntaxHighlighter
                                        style={codeTheme}
                                        language='python'
                                        PreTag="div"
                                        {...props}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
                                ) : (
                                        <code className='simple-code' {...props}>
                                        {children}
                                        </code>
                                    )
                            }
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                    {/* <div className='post-parsed-md' dangerouslySetInnerHTML={{__html: marked.parse(post.content)}}></div> */}
                    </div>
                </div>
            </section>
        </>
    )
};

export async function getStaticPaths(){
    const files = fs.readdirSync(path.join('posts'));
    const paths = files.map(filename => ({
        params: {
            slug: filename.replace('.md', '')
        }
    }));

    return {paths, fallback: false};
}

export async function getStaticProps(object: StaticResponse ){
    const slug: string = object.params.slug;
    if(!slug || slug === null || slug === undefined){
        throw new Error("Slug was not defined, define it inside the .md file");
    }
    const markdownWithMeta = fs.readFileSync(path.join('posts', slug + '.md'), 'utf-8');
    const {data, content} = matter(markdownWithMeta);

      
    const post: Post = {
        slug, 
        content,
        author: data.author ?? null,
        cover_image: data.cover_image ?? null,
        categories: data.categories ?? null,
        date:data.date ?? null,
        excerpt: data.excerpt ?? null, 
        title: data.title ?? null,
        code_theme: data.code_theme ?? null
    };
    return {
        props:{ post } 
    };
}

export default PostPage;