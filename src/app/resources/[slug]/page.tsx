import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHero } from '@/components/tbc/page-hero'
import { Reveal } from '@/components/tbc/reveal'

interface Props { params: Promise<{ slug: string }> }

export default async function ResourceDetailPage({ params }: Props) {
  const { slug } = await params
  const article = await db.article.findUnique({ where: { slug } })

  if (!article) notFound()

  return (
    <>
      <PageHero badge={article.category || 'Article'} title={article.title} />

      <section className="py-12 lg:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <article className="bg-white rounded-xl p-6 lg:p-10 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-5 w-5 text-tbc-red" />
                {article.category && <Badge className="bg-tbc-red-light text-tbc-red">{article.category}</Badge>}
                {article.author && <span className="text-sm text-tbc-gray">By {article.author}</span>}
              </div>

              {article.excerpt && (
                <p className="text-lg text-tbc-gray leading-relaxed mb-6 font-medium border-l-4 border-tbc-red pl-4">{article.excerpt}</p>
              )}

              {article.content && (
                <div className="prose prose-gray max-w-none">
                  <p className="text-tbc-gray leading-relaxed">{article.content}</p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-100">
                <Button asChild variant="outline" className="border-tbc-red text-tbc-red hover:bg-tbc-red hover:text-white">
                  <Link href="/resources"><ArrowLeft className="mr-2 h-4 w-4" />Back to Resources</Link>
                </Button>
              </div>
            </article>
          </Reveal>
        </div>
      </section>
    </>
  )
}
