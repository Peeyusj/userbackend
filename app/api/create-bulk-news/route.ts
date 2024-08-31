import { db } from "@/db";
import { newsArticle } from "@/db/schemas/news";

interface NewsArticleSchema {
  content: string;
  markdownContent: string;
  title: string;
  description: string;
  imgSrc?: string;
  category_id: number;
  priority: number;
  author: string;
  tags: string[];
  created_at?: string;
}

export async function POST(req: Request) {
  try {
    const payload = (await req.json()) as NewsArticleSchema[];
    await db.insert(newsArticle).values(
      payload.map((article) => ({
        content: article.content,
        markdownContent: article.markdownContent,
        title: article.title,
        description: article.description,
        imgSrc: article.imgSrc,
        category: article.category_id,
        priority: article.priority,
        author: article.author,
        tags: article.tags,
        created_at: article.created_at,
      }))
    );

    return Response.json({
      success: true,
      message: "Articles Created Successfully",
    });
  } catch (e) {
    console.error(e);
    return Response.error();
  }
}