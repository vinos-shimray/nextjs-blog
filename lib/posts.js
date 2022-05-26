import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark';
import html from 'remark-html'

const postsDirectory=path.join(process.cwd(),'posts');

export function getSortedPostsData(){
    //get file names under /posts
    const fileName=fs.readdirSync(postsDirectory);
    const allPostsData=fileName.map((fileName)=>{
        //remove .md from the file name to get id
        const id=fileName.replace(/\.md$/,'');

        //read markdown as string
        const fullPath=path.join(postsDirectory,fileName);
        console.log(fullPath);
        const fileContents=fs.readFileSync(fullPath,'utf-8');
        // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  });
  return allPostsData.sort(({ date: a }, { date: b }) => {
    if (a < b) {
      return 1;
    } else if (a > b) {
      return -1;
    } else {
      return 0;
    }
    })
}

export function getAllPostIds(){
  const fileName=fs.readdirSync(postsDirectory);
  // Returns an array that looks like this:
  // [
  //   {
  //     params: {
  //       id: 'ssg-ssr'
  //     }
  //   },
  //   {
  //     params: {
  //       id: 'pre-rendering'
  //     }
  //   }
  // ]

  return fileName.map((fileName)=>{
    return {
      params:{
        id:fileName.replace(/\.md$/,''),
      },
    };
  });
}

export  async function getPostData(id){
  const fullPath=path.join(postsDirectory,`${id}.md`);
  const fileContents =fs.readFileSync(fullPath,'utf-8');

  const matterResult=matter(fileContents);

  const processContent=await remark()
  .use(html)
  .process(matterResult.content);
  const contentHtml=processContent.toString();
  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}