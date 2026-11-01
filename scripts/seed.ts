import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.eventRegistration.deleteMany()
  await prisma.chapterMembership.deleteMany()
  await prisma.visitorRequest.deleteMany()
  await prisma.membershipApplication.deleteMany()
  await prisma.contactInquiry.deleteMany()
  await prisma.member.deleteMany()
  await prisma.event.deleteMany()
  await prisma.article.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.chapter.deleteMany()
  await prisma.siteConfig.deleteMany()
  await prisma.user.deleteMany()

  // Site Config
  const configs = [
    { key: 'stat_members', value: '500' },
    { key: 'stat_chapters', value: '12' },
    { key: 'stat_categories', value: '45' },
    { key: 'stat_connections', value: '2500' },
    { key: 'stat_referrals', value: '1800' },
    { key: 'org_name', value: 'TBC — Tailik Business Committee' },
    { key: 'org_phone', value: '9301056006' },
    { key: 'org_address', value: 'Gandhi Nagar, Pahari Chowk, Gudhiyari, Raipur (C.G.), India' },
  ]
  for (const c of configs) {
    await prisma.siteConfig.create({ data: c })
  }

  // Chapters
  const chapters = await Promise.all([
    prisma.chapter.create({
      data: {
        name: 'TBC Raipur Central',
        slug: 'raipur-central',
        location: 'Hotel Babylon, Raipur',
        city: 'Raipur',
        area: 'Central',
        meetingDay: 'Tuesday',
        meetingTime: '07:30 AM',
        description: 'The flagship chapter of TBC in the heart of Raipur, bringing together diverse business professionals for weekly networking and referrals.',
        categories: 'Healthcare,Finance,Real Estate,IT Services,Education',
        active: true,
      },
    }),
    prisma.chapter.create({
      data: {
        name: 'TBC Raipur South',
        slug: 'raipur-south',
        location: 'Convention Center, Raipur',
        city: 'Raipur',
        area: 'South',
        meetingDay: 'Wednesday',
        meetingTime: '08:00 AM',
        description: 'A vibrant chapter serving south Raipur with professionals from construction, hospitality, and professional services.',
        categories: 'Construction,Hospitality,Legal,Marketing,Automotive',
        active: true,
      },
    }),
    prisma.chapter.create({
      data: {
        name: 'TBC Bilaspur',
        slug: 'bilaspur',
        location: 'Hotel East Park, Bilaspur',
        city: 'Bilaspur',
        area: 'Central',
        meetingDay: 'Thursday',
        meetingTime: '07:30 AM',
        description: 'Connecting business owners and entrepreneurs in Bilaspur for mutual growth and trusted referrals.',
        categories: 'Manufacturing,Retail,Healthcare,Insurance,Food & Beverage',
        active: true,
      },
    }),
    prisma.chapter.create({
      data: {
        name: 'TBC Durg',
        slug: 'durg',
        location: 'City Center, Durg',
        city: 'Durg',
        area: 'Central',
        meetingDay: 'Friday',
        meetingTime: '08:00 AM',
        description: 'A growing chapter in Durg bringing together professionals from diverse business backgrounds.',
        categories: 'Education,Technology,Agriculture,Transport,Textiles',
        active: true,
      },
    }),
    prisma.chapter.create({
      data: {
        name: 'TBC Korba',
        slug: 'korba',
        location: 'Business Hub, Korba',
        city: 'Korba',
        area: 'North',
        meetingDay: 'Saturday',
        meetingTime: '09:00 AM',
        description: 'TBC Korba chapter focuses on energy sector professionals, industrial services, and local business growth.',
        categories: 'Energy,Industrial,Engineering,Consulting,Logistics',
        active: true,
      },
    }),
    prisma.chapter.create({
      data: {
        name: 'TBC Bhilai',
        slug: 'bhilai',
        location: 'Steel City Mall, Bhilai',
        city: 'Bhilai',
        area: 'West',
        meetingDay: 'Wednesday',
        meetingTime: '07:30 AM',
        description: 'Serving the industrial city of Bhilai with a strong network of steel, manufacturing, and service professionals.',
        categories: 'Steel,Metal Works,Accounting,Automotive,Healthcare',
        active: true,
      },
    }),
  ])

  // Members
  const memberData = [
    { name: 'Rajesh Sharma', email: 'rajesh@tbc.com', phone: '9876543210', business: 'Sharma Healthcare', category: 'Healthcare', profession: 'Doctor', city: 'Raipur', description: 'Leading healthcare provider with 15+ years of experience in multi-specialty medical services.', chapterId: chapters[0].id, featured: true },
    { name: 'Priya Patel', email: 'priya@tbc.com', phone: '9876543211', business: 'Patel Financial Services', category: 'Finance', profession: 'Financial Advisor', city: 'Raipur', description: 'Expert financial planner helping businesses and individuals achieve their financial goals.', chapterId: chapters[0].id, featured: true },
    { name: 'Amit Singh', email: 'amit@tbc.com', phone: '9876543212', business: 'Singh Real Estate', category: 'Real Estate', profession: 'Real Estate Developer', city: 'Raipur', description: 'Trusted real estate developer with premium residential and commercial projects in Raipur.', chapterId: chapters[0].id, featured: true },
    { name: 'Neha Gupta', email: 'neha@tbc.com', phone: '9876543213', business: 'Gupta IT Solutions', category: 'IT Services', profession: 'Software Developer', city: 'Raipur', description: 'Providing innovative IT solutions, web development, and digital transformation services.', chapterId: chapters[0].id, featured: false },
    { name: 'Vikram Chauhan', email: 'vikram@tbc.com', phone: '9876543214', business: 'Chauhan Builders', category: 'Construction', profession: 'Civil Engineer', city: 'Raipur', description: 'Quality construction and infrastructure development with a commitment to excellence.', chapterId: chapters[1].id, featured: true },
    { name: 'Sunita Verma', email: 'sunita@tbc.com', phone: '9876543215', business: 'Verma Legal Associates', category: 'Legal', profession: 'Lawyer', city: 'Raipur', description: 'Experienced legal counsel for corporate, real estate, and business compliance matters.', chapterId: chapters[1].id, featured: false },
    { name: 'Deepak Tiwari', email: 'deepak@tbc.com', phone: '9876543216', business: 'Tiwari Motors', category: 'Automotive', profession: 'Business Owner', city: 'Raipur', description: 'Authorized automobile dealership providing sales, service, and financing solutions.', chapterId: chapters[1].id, featured: false },
    { name: 'Anjali Deshmukh', email: 'anjali@tbc.com', phone: '9876543217', business: 'Deshmukh Marketing', category: 'Marketing', profession: 'Marketing Consultant', city: 'Bilaspur', description: 'Strategic marketing consulting helping businesses build strong brands and grow their market presence.', chapterId: chapters[2].id, featured: true },
    { name: 'Suresh Reddy', email: 'suresh@tbc.com', phone: '9876543218', business: 'Reddy Retail Chain', category: 'Retail', profession: 'Retail Entrepreneur', city: 'Bilaspur', description: 'Multi-location retail business with expertise in consumer goods and supply chain management.', chapterId: chapters[2].id, featured: false },
    { name: 'Kavita Joshi', email: 'kavita@tbc.com', phone: '9876543219', business: 'Joshi Insurance', category: 'Insurance', profession: 'Insurance Advisor', city: 'Durg', description: 'Comprehensive insurance solutions for life, health, and business with personalized service.', chapterId: chapters[3].id, featured: true },
    { name: 'Manoj Kumar', email: 'manoj@tbc.com', phone: '9876543220', business: 'Kumar Tech Solutions', category: 'Technology', profession: 'Tech Entrepreneur', city: 'Durg', description: 'Innovative technology solutions including cloud services, AI integration, and digital marketing.', chapterId: chapters[3].id, featured: false },
    { name: 'Rashmi Agarwal', email: 'rashmi@tbc.com', phone: '9876543221', business: 'Agarwal Education', category: 'Education', profession: 'Education Director', city: 'Raipur', description: 'Leading educational institution providing quality training and professional development programs.', chapterId: chapters[0].id, featured: false },
  ]

  const members = await Promise.all(
    memberData.map((m) =>
      prisma.member.create({
        data: {
          ...m,
          photo: null,
          location: m.city,
          active: true,
        },
      })
    )
  )

  // Chapter Memberships
  for (const member of members) {
    if (member.chapterId) {
      await prisma.chapterMembership.create({
        data: {
          memberId: member.id,
          chapterId: member.chapterId,
          role: member.featured ? 'president' : 'member',
        },
      })
    }
  }

  // Events
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'TBC Annual Business Summit 2026',
        slug: 'annual-business-summit-2026',
        description: 'The flagship annual event of TBC bringing together all chapters for a day of networking, keynote sessions, and business growth opportunities.',
        date: '2026-10-15',
        time: '09:00 AM - 05:00 PM',
        location: 'Hotel Babylon International, Raipur',
        type: 'summit',
        featured: true,
        active: true,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Networking Breakfast — Raipur Central',
        slug: 'networking-breakfast-raipur-central',
        description: 'Weekly networking breakfast meeting for TBC Raipur Central chapter members and visitors.',
        date: '2026-09-09',
        time: '07:30 AM - 09:00 AM',
        location: 'Hotel Babylon, Raipur',
        chapterId: chapters[0].id,
        type: 'networking',
        featured: false,
        active: true,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Digital Marketing Workshop',
        slug: 'digital-marketing-workshop',
        description: 'Hands-on workshop covering SEO, social media strategy, and paid advertising for business growth.',
        date: '2026-09-20',
        time: '10:00 AM - 01:00 PM',
        location: 'TBC Office, Gandhi Nagar, Raipur',
        type: 'workshop',
        featured: true,
        active: true,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Business Referral Training',
        slug: 'business-referral-training',
        description: 'Learn the art of generating quality business referrals and building trusted professional relationships.',
        date: '2026-09-25',
        time: '06:00 PM - 08:00 PM',
        location: 'Convention Center, Raipur',
        type: 'seminar',
        featured: false,
        active: true,
      },
    }),
    prisma.event.create({
      data: {
        title: 'TBC Women Entrepreneurs Meet',
        slug: 'women-entrepreneurs-meet',
        description: 'A special networking event celebrating and empowering women entrepreneurs in the TBC community.',
        date: '2026-10-05',
        time: '10:00 AM - 01:00 PM',
        location: 'City Center, Raipur',
        type: 'networking',
        featured: true,
        active: true,
      },
    }),
    prisma.event.create({
      data: {
        title: 'Financial Planning Seminar',
        slug: 'financial-planning-seminar',
        description: 'Expert-led seminar on business financial planning, tax strategies, and investment opportunities.',
        date: '2026-10-12',
        time: '04:00 PM - 07:00 PM',
        location: 'Hotel East Park, Bilaspur',
        type: 'seminar',
        featured: false,
        active: true,
      },
    }),
  ])

  // Testimonials
  await Promise.all([
    prisma.testimonial.create({
      data: {
        name: 'Rajesh Sharma',
        business: 'Sharma Healthcare',
        category: 'Healthcare',
        quote: 'TBC has transformed my professional network completely. The quality of referrals I receive has helped my healthcare practice grow by 40% in just one year. The trust and relationships built here are invaluable.',
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Priya Patel',
        business: 'Patel Financial Services',
        category: 'Finance',
        quote: 'Being part of TBC has been a game-changer for my financial advisory business. The structured networking and accountability system ensures consistent growth and meaningful business connections.',
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Vikram Chauhan',
        business: 'Chauhan Builders',
        category: 'Construction',
        quote: 'The referrals I get through TBC are of exceptional quality. Each connection is pre-qualified through trust, making business conversions much higher than any other networking platform I have tried.',
        featured: true,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Anjali Deshmukh',
        business: 'Deshmukh Marketing',
        category: 'Marketing',
        quote: 'TBC gave me the platform to scale my marketing consultancy from a solo practice to a team of five. The collaborative spirit and genuine support from fellow members is what sets TBC apart.',
        featured: false,
      },
    }),
    prisma.testimonial.create({
      data: {
        name: 'Kavita Joshi',
        business: 'Joshi Insurance',
        category: 'Insurance',
        quote: 'I joined TBC as a new entrepreneur and within months, I had a thriving client base purely through chapter referrals. The mentorship and guidance from experienced members has been extraordinary.',
        featured: false,
      },
    }),
  ])

  // Articles / Resources
  await Promise.all([
    prisma.article.create({
      data: {
        title: 'The Power of Business Networking in Chhattisgarh',
        slug: 'power-of-business-networking',
        excerpt: 'Discover how structured business networking is transforming the entrepreneurial landscape of Chhattisgarh and creating new growth opportunities.',
        content: 'Business networking in Chhattisgarh has evolved significantly over the past decade. Organizations like TBC are at the forefront of this transformation, creating structured environments where professionals can build trusted relationships, exchange quality referrals, and grow their businesses together. The power of face-to-face networking, combined with a structured referral system, creates measurable business results that online platforms simply cannot replicate.',
        category: 'Networking',
        author: 'TBC Editorial',
        published: true,
      },
    }),
    prisma.article.create({
      data: {
        title: 'How to Maximize Your TBC Membership',
        slug: 'maximize-tbc-membership',
        excerpt: 'Practical strategies and tips to get the most value from your TBC membership and build a powerful referral network.',
        content: 'Your TBC membership is an investment in your business growth. Here are proven strategies to maximize your returns: attend meetings consistently, give referrals before expecting them, build one-to-one relationships outside meetings, and actively participate in chapter activities. The members who see the greatest returns are those who treat TBC not as a lead generation tool, but as a relationship-building platform.',
        category: 'Tips',
        author: 'TBC Editorial',
        published: true,
      },
    }),
    prisma.article.create({
      data: {
        title: 'Building Trust in Professional Relationships',
        slug: 'building-trust-professional-relationships',
        excerpt: 'Trust is the foundation of every successful business relationship. Learn how TBC\'s structured approach helps build and maintain professional trust.',
        content: 'Trust doesn\'t happen overnight — it is built through consistent actions, reliable follow-through, and genuine care for others\' success. TBC\'s structured networking format creates the perfect environment for trust to develop naturally over time. Weekly meetings, accountability systems, and the culture of "givers gain" ensure that trust is not just encouraged but systematically cultivated.',
        category: 'Business Growth',
        author: 'TBC Editorial',
        published: true,
      },
    }),
    prisma.article.create({
      data: {
        title: 'Success Stories: Growing Through Referrals',
        slug: 'success-stories-growing-through-referrals',
        excerpt: 'Real stories from TBC members who have experienced remarkable business growth through the power of quality referrals.',
        content: 'Every TBC chapter has success stories that inspire. From small businesses doubling their revenue to new entrepreneurs finding their first clients, the referral system at TBC creates tangible, measurable business results. These stories are not exceptions — they are the natural outcome of a well-structured networking system built on trust, accountability, and genuine commitment to each other\'s success.',
        category: 'Success Stories',
        author: 'TBC Editorial',
        published: true,
      },
    }),
  ])

  console.log('✅ Seed complete!')
  console.log(`  Chapters: ${chapters.length}`)
  console.log(`  Members: ${members.length}`)
  console.log(`  Events: ${events.length}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
