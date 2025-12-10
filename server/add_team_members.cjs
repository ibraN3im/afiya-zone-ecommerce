const mongoose = require('mongoose');
const TeamMember = require('./models/TeamMember');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/afiya-zone-store', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const teamMembers = [

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
