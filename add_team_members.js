const mongoose = require('mongoose');
const TeamMember = require('./server/models/TeamMember');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/afiya-zone-store', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const teamMembers = [
    {
        name: {
            en: 'Dr. Sarah Al-Zahra',
            ar: 'د. سارة الزهراء'
        },
        position: {
            en: 'Founder & CEO',
            ar: 'المؤسس والرئيس التنفيذي'
        },
        bio: {
            en: 'Certified nutritionist and wellness expert with over 15 years of experience in natural health and traditional medicine.',
            ar: 'خبيرة تغذية معتمدة وخبيرة عافية مع أكثر من 15 عاماً من الخبرة في الصحة الطبيعية والطب التقليدي.'
        },
        image: 'https://images.unsplash.com/photo-1671492241057-e0ad01ceb1c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMG5hdHVyYWwlMjBwcm9kdWN0cyUyMHNwYXxlbnwxfHx8fDE3NTkwNzU2MTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        email: 'sarah@afiya-zone.com',
        phone: '+971 50 123 4567',
        department: 'management',
        order: 1,
        isActive: true
    },
    {
        name: {
            en: 'Ahmed Hassan',
            ar: 'أحمد حسن'
        },
        position: {
            en: 'Head of Product Development',
            ar: 'رئيس تطوير المنتجات'
        },
        bio: {
            en: 'Biochemist specializing in natural product research and development with a passion for creating effective wellness solutions.',
            ar: 'عالم كيمياء حيوية متخصص في بحث وتطوير المنتجات الطبيعية مع شغف لإنشاء حلول عافية فعالة.'
        },
        image: 'https://images.unsplash.com/photo-1734607402858-a10164ded7a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwc3VwcGxlbWVudHMlMjB2aXRhbWluc3xlbnwxfHx8fDE3NTkwNzU2MjF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        email: 'ahmed@afiya-zone.com',
        phone: '+971 50 234 5678',
        department: 'technical',
        order: 2,
        isActive: true
    },
    {
        name: {
            en: 'Fatima Al-Rashid',
            ar: 'فاطمة الراشد'
        },
        position: {
            en: 'Customer Wellness Specialist',
            ar: 'أخصائية عافية العملاء'
        },
        bio: {
            en: 'Certified health coach dedicated to helping customers find the right products for their individual wellness needs.',
            ar: 'مدربة صحة معتمدة مكرسة لمساعدة العملاء في العثور على المنتجات المناسبة لاحتياجات عافيتهم الفردية.'
        },
        image: 'https://images.unsplash.com/photo-1723392197044-515b81ec57cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwc2tpbmNhcmUlMjBjb3NtZXRpY3N8ZW58MXx8fHwxNzU5MDc1NjI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
        email: 'fatima@afiya-zone.com',
        phone: '+971 50 345 6789',
        department: 'support',
        order: 3,
        isActive: true
    }
];

async function addTeamMembers() {
    try {
        console.log('Connecting to database...');
        await mongoose.connection;

        console.log('Clearing existing team members...');
        await TeamMember.deleteMany({});

        console.log('Adding team members...');
        const insertedMembers = await TeamMember.insertMany(teamMembers);

        console.log(`Successfully added ${insertedMembers.length} team members:`);
        insertedMembers.forEach((member, index) => {
            console.log(`${index + 1}. ${member.name.en} - ${member.position.en}`);
        });

        console.log('Team members have been added to the database!');
    } catch (error) {
        console.error('Error adding team members:', error);
    } finally {
        await mongoose.connection.close();
    }
}

addTeamMembers();
