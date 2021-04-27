# reactSSR简结

## 参考链接

* [nextjs](https://www.nextjs.cn/)
* [从0开始微操SSR之nextjs项目实践](https://zhuanlan.zhihu.com/p/305880674)
* [nextjs集成redux](https://blog.csdn.net/qq_40566547/article/details/102251468)
* [Next.js 静态生成和服务器端渲染](https://www.jianshu.com/p/9172f1d560c6)
* [下一个“构建时间”何时发生？](https://www.5axxw.com/questions/content/rjupfp)
* [初探 nextjs 服务端渲染框架](https://juejin.cn/post/6844904165630541837)
* [react入门坑（next篇）之antd按需引入](https://segmentfault.com/a/1190000038819688)
* [NextJS-集成antd](https://blog.csdn.net/baidu_33591715/article/details/108654744)

## 目录

* [预渲染](#预渲染)
* [项目搭建](#项目搭建)
* [sass](#sass)
* [路由](#路由)
* [nextjs集成redux](#nextjs集成redux)
* [数据预取](#数据预取)
* [引入插件](#引入插件)

## 预渲染

默认情况下，Next.js 将 预渲染 每个 page（页面）。这意味着 Next.js 会预先为每个页面生成 HTML 文件，而不是由客户端 JavaScript 来完成。预渲染可以带来更好的性能和 SEO 效果。

Next.js 具有两种形式的预渲染： 静态生成（Static Generation） 和 服务器端渲染（Server-side Rendering）。这两种方式的不同之处在于为 page（页面）生成 HTML 页面的 时机 。

静态生成 （推荐）：HTML 在 构建时 生成，并在每次页面请求（request）时重用。

服务器端渲染：在 每次页面请求（request）时 重新生成 HTML。

Next.js 允许你为每个页面 选择 预渲染的方式。你可以创建一个 “混合渲染” 的 Next.js 应用程序：对大多数页面使用“静态生成”，同时对其它页面使用“服务器端渲染”。

## 项目搭建

Node.js 10.13 或更高版本

npx create-next-app

```txt
.next ----------- 编译出来的资源
components ------ 抽离的公用组件
pages ----------- 前端页面文件夹，根据pages文件结构，生成页面地址
    api --------- 后端接口相关
public ---------- 前端图片资源存放文件夹
styles ---------- 样式文件
next.config.js -- nextjs项目配置文件
```

## sass

npm install sass

next.config.js
```js
const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}
```

## 路由

```txt
pages/index.js → /
pages/blog/index.js → /blog
pages/blog/first-post.js → /blog/first-post
pages/dashboard/settings/username.js → /dashboard/settings/username
pages/blog/[slug].js → /blog/:slug (/blog/hello-world)
pages/[username]/settings.js → /:username/settings (/foo/settings)
pages/post/[...all].js → /post/* (/post/2020/id/title)
```

```ts
import Link from 'next/link'

function Home() {
  return (
    <ul>
      <li>
        <Link href="/">
          <a>Home</a>
        </Link>
      </li>
      <li>
        <Link href="/about">
          <a>About Us</a>
        </Link>
      </li>
      <li>
        <Link href="/blog/hello-world">
          <a>Blog Post</a>
        </Link>
      </li>
    </ul>
  )
}

export default Home
```

```ts
import { useRouter } from 'next/router'

function ReadMore() {
  const router = useRouter()

  return (
    <span onClick={() => router.push('/about')}>Click here to read more</span>
  )
}

export default ReadMore
```

## nextjs集成redux

[nextjs集成redux](https://blog.csdn.net/qq_40566547/article/details/102251468)

## 数据预取

* 静态生成

    * getStaticProps（gSProps）
    
        只在build期间运行。
        
        对于那些数据和页面不经常更新的站点来说，这是非常好的。
        
        这种方法的优点是页面是静态生成的，因此如果用户在初始加载时请求页面，他们将下载一个优化的页面，其中动态数据已经烘焙到页面中。
        
        最常见的使用原因是博客或某种可能不会经常更改的大型购物目录。

    * getStaticPaths（gSPaths）
    
        只在build期间运行。
        
        这对于pre-rendering类似的路径（blog/story/：id）来说非常好，因为它们需要在build-time使用动态数据。
        
        当与gSProps结合使用时，它从数据库生成动态页面，然后可以静态地为其提供服务。
        
        最常见的用例是一个博客，它有许多帖子共享相同的页面布局和相似的页面URL结构，但需要在构建应用程序时动态烘焙内容。

    ```ts
    import { useRouter } from 'next/router'

    function Post(props) {
        const router = useRouter()
        const { id } = router.query
        // Render post...
        return (
            <>
                <div>{id}</div>
                <div onClick={() => router.push('/')}>{JSON.stringify(props)}</div>
            </>
        );
    }

    export async function getStaticPaths() {
        return {
            paths: [
                { params: { id: '1' } },
                { params: { id: '2' } }
            ],
            fallback: false
        };
    }

    // 在使用 getStaticProps 静态生成
    export async function getStaticProps({ params }) {
        // 参数包含post ' id '。
        // 如果路由类似/posts/1，则params。id是1
        const res = await fetch(`https://api.github.com/repos/vercel/next.js`)
        const post = await res.json()

        // 通过道具将post数据传递到页面
        return { props: post }
    }

    export default Post
    ```

* 服务器端渲染

    * getInitialProps（gIP）
    
        在运行时为每个页面请求在客户端和服务器上运行。
        
        最常见的用例是在加载请求的页面之前检索某种共享数据（比如cookie会话，它让客户机和服务器知道用户是否正在导航到经过身份验证的页面）。
        
        它总是在getServerSideProps之前运行。

    * getServerSideProps（gSSP）
    
        只在运行时为每个页面请求在服务器上运行。
        
        最常见的用例是在页面加载之前从数据库中检索up-to-date，page-specific数据（比如产品的定价和显示库存量）。
        
        当你想要一个页面被搜索引擎优化（SEO）时，这一点很重要，搜索引擎会索引最多的up-to-date站点数据。

    ```ts
    import React from 'react'

    class Page extends React.Component {
        static async getInitialProps(ctx) {
            const res = await fetch('https://api.github.com/repos/vercel/next.js')
            const json = await res.json()
            return { stars: json.stargazers_count }
        }

        componentDidMount() {
            
        }

        render() {
            return (
            <div>Next stars: {this.props.stars}</div>
            )
        }
    }

    export default Page
    ```

    ```ts
    import { GetServerSideProps } from 'next' //TypeScript：使用 GetServerSideProps

    export async function getServerSideProps:GetServerSideProps (context) {
        return {
            props: {}, // 将作为道具传递到页面组件
        }
    }
    ```

## 引入插件

* antd

    next版本10.0.6

    npm install css-loader @zeit/next-css @zeit/next-sass babel-plugin-import antd --save

    * _app.js

        ```js
        import 'antd/dist/antd.min.css'
        ```

    * 页面

        ```js
        import React from 'react'
        import { Button,Cascader } from 'antd'

        class Antd extends React.Component {
            constructor(props) {
                super(props);
                this.state = {
                    count: 1
                };
                console.log("1. constructor", this.state.count);
            }

            componentDidMount() {

            }

            render() {

                let options = [
                    {
                        value: 'zhejiang',
                        label: 'Zhejiang',
                        children: [
                            {
                                value: 'hangzhou',
                                label: 'Hangzhou',
                                children: [
                                    {
                                        value: 'xihu',
                                        label: 'West Lake',
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        value: 'jiangsu',
                        label: 'Jiangsu',
                        children: [
                            {
                                value: 'nanjing',
                                label: 'Nanjing',
                                children: [
                                    {
                                        value: 'zhonghuamen',
                                        label: 'Zhong Hua Men',
                                    },
                                ],
                            },
                        ],
                    },
                ];
                function onChange(value) {
                    console.log(value);
                }
                return (
                    <>
                        <div>Antd</div>
                        <Button type="primary">test Antd</Button>
                        <Cascader options={options} onChange={onChange} placeholder="Please select" />
                    </>
                )
            }
        }

        export default Antd
        ```