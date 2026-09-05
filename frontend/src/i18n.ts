import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  EN: {
    translation: {
      appName: 'SahakarConnect',
      tagline: 'Cooperative Gig Services Platform',
      sihBadge: 'Smart India Hackathon 2026 | PS 26089',
      ministryTitle: "Ministry of Cooperation, Gov't of India",
      nav: {
        home: 'Home',
        bookService: 'Book Service',
        myBookings: 'My Bookings',
        workerDashboard: 'Worker Hub',
        coopAdmin: 'Cooperative Admin',
        govPortal: 'Ministry Portal',
        login: 'Login',
        logout: 'Logout',
        quickSwitch: 'Demo Role Switcher'
      },
      hero: {
        title: 'Dignity & Fair Pay for Every Gig Worker',
        subtitle: 'Replacing 25-30% corporate commissions with 100% worker-owned cooperatives. 80% goes directly to the worker, 15% to their cooperative welfare & insurance fund, and only 5% platform fee.',
        exploreBtn: 'Explore Services',
        loginBtn: 'Worker / Admin Access',
        statWorkers: 'Workers Owned',
        statCoops: 'Approved Cooperatives',
        statPayout: 'Direct Worker Payout',
        statFee: 'Platform Fee'
      },
      comparison: {
        title: 'Corporate Giants vs. SahakarConnect',
        subtitle: 'See how our cooperative model puts thousands of rupees back into Indian household workers’ pockets.',
        orderValue: 'Service Order Value',
        corporateApp: 'Corporate Aggregators (Urban Company/Uber)',
        sahakarApp: 'SahakarConnect Cooperative Model',
        workerShare: 'Direct to Worker',
        coopFund: 'Worker Cooperative Welfare Fund',
        platformFee: 'Platform Commission'
      },
      categories: {
        title: 'Household & Community Services',
        subtitle: 'Verified skilled workers from certified local cooperatives',
        cleaning: 'Cleaning',
        plumbing: 'Plumbing',
        electrical: 'Electrical',
        tutoring: 'Tutoring',
        caregiving: 'Caregiving',
        appliance: 'Appliance Repair',
        startingFrom: 'Starting from'
      },
      search: {
        searchPlaceholder: 'Search workers or skills...',
        allCategories: 'All Categories',
        allDistricts: 'All Districts / Cities',
        smartRanking: 'Smart AI Match Ranking Active',
        rankingTooltipTitle: 'How AI Smart Match Works (PS 26089)',
        rankingFormula: 'Score = 40% Proximity + 30% Rating + 20% Availability + 10% Skill Match',
        bookNow: 'Book Service',
        available: 'Available Now',
        offline: 'Offline',
        verifiedBadge: 'Coop Verified Member'
      },
      booking: {
        title: 'Schedule a Service',
        address: 'Service Address',
        instructions: 'Special Instructions / Problem description',
        date: 'Scheduled Date & Time',
        confirm: 'Confirm Booking',
        transparentBreakdown: 'Transparent Payout Breakdown (SIH Model)',
        directWorkerLabel: '80% Direct to Worker',
        coopFundLabel: '15% Cooperative Welfare Fund',
        platformFeeLabel: '5% Platform Maintenance Fee',
        totalPayable: 'Total Payable Amount',
        status: {
          REQUESTED: 'Requested',
          ACCEPTED: 'Accepted',
          IN_PROGRESS: 'In Progress',
          COMPLETED: 'Completed',
          CANCELLED: 'Cancelled',
          DISPUTED: 'Disputed'
        }
      },
      governance: {
        title: 'Democratic Cooperative Governance',
        subtitle: 'One Member, One Vote — Every worker has equal ownership and voice.',
        openProposals: 'Open Proposals for Voting',
        closedProposals: 'Closed Decisions & Results',
        castVote: 'Cast Vote',
        voted: 'Vote Cast',
        leadingChoice: 'Current Leading Choice',
        totalVotes: 'Total Votes Cast',
        createProposal: 'Create New Proposal'
      },
      worker: {
        availability: 'Work Availability',
        online: 'Online (Accepting Jobs)',
        offline: 'Offline (Paused)',
        jobFeed: 'Incoming Job Requests',
        accept: 'Accept Job',
        decline: 'Decline',
        startJob: 'Start Job',
        completeJob: 'Complete Job & Release Payout',
        earningsTitle: 'Personal Earnings & Cooperative Contribution',
        totalEarned: 'Total Earnings (80% Direct)',
        coopContribution: 'Your Contribution to Coop Fund (15%)',
        completedJobs: 'Completed Jobs'
      },
      admin: {
        govOverview: 'National Cooperative Oversight & Macro Analytics',
        coopDirectory: 'Cooperative Directory & Approval Queue',
        totalGmv: 'Total Platform GMV',
        totalPayouts: 'Worker Earnings Distributed',
        totalCoopFunds: 'Cooperative Welfare Reserves',
        demandCategory: 'Demand by Service Category',
        demandDistrict: 'Demand by District / Region',
        flaggedCoops: 'Quality & Dispute Monitoring (Flagged Cooperatives)'
      }
    }
  },
  HI: {
    translation: {
      appName: 'सहकार कनेक्ट',
      tagline: 'सहकारी गिग सेवा मंच',
      sihBadge: 'स्मार्ट इंडिया हैकाथॉन 2026 | समस्या विवरण 26089',
      ministryTitle: 'सहकारिता मंत्रालय, भारत सरकार',
      nav: {
        home: 'होम',
        bookService: 'सेवा बुक करें',
        myBookings: 'मेरी बुकिंग्स',
        workerDashboard: 'श्रमिक हब',
        coopAdmin: 'सहकारी समिति एडमिन',
        govPortal: 'मंत्रालय पोर्टल',
        login: 'लॉग इन',
        logout: 'लॉग आउट',
        quickSwitch: 'डेमो रोल स्विचर'
      },
      hero: {
        title: 'प्रत्येक गिग श्रमिक के लिए सम्मान और उचित मजदूरी',
        subtitle: '25-30% कॉर्पोरेट कमीशन को 100% श्रमिक-स्वामित्व वाली सहकारी समितियों से बदलना। 80% सीधे श्रमिक को, 15% सहकारी कल्याण व बीमा कोष को, और केवल 5% प्लेटफॉर्म शुल्क।',
        exploreBtn: 'सेवाएं देखें',
        loginBtn: 'श्रमिक / एडमिन लॉगिन',
        statWorkers: 'श्रमिक स्वामित्व',
        statCoops: 'स्वीकृत सहकारी समितियां',
        statPayout: 'प्रत्यक्ष श्रमिक भुगतान',
        statFee: 'प्लेटफॉर्म शुल्क'
      },
      comparison: {
        title: 'कॉर्पोरेट दिग्गज बनाम सहकार कनेक्ट',
        subtitle: 'देखें कैसे हमारा सहकारी मॉडल भारतीय घरेलू श्रमिकों की जेब में हजारों रुपये बचाता है।',
        orderValue: 'सेवा मूल्य',
        corporateApp: 'कॉर्पोरेट ऐप्स (अर्बन कंपनी / उबर)',
        sahakarApp: 'सहकार कनेक्ट सहकारी मॉडल',
        workerShare: 'सीधे श्रमिक को (80%)',
        coopFund: 'सहकारी कल्याण कोष (15%)',
        platformFee: 'प्लेटफॉर्म कमीशन (5%)'
      },
      categories: {
        title: 'घरेलू एवं सामुदायिक सेवाएं',
        subtitle: 'प्रमाणित स्थानीय सहकारी समितियों से सत्यापित कुशल श्रमिक',
        cleaning: 'सफाई',
        plumbing: 'प्लंबिंग',
        electrical: 'इलेक्ट्रिकल',
        tutoring: 'ट्यूशन',
        caregiving: 'देखभाल सेवा',
        appliance: 'उपकरण मरम्मत',
        startingFrom: 'न्यूनतम दर'
      },
      search: {
        searchPlaceholder: 'श्रमिक या कौशल खोजें...',
        allCategories: 'सभी श्रेणियां',
        allDistricts: 'सभी जिले / शहर',
        smartRanking: 'स्मार्ट एआई मैच रैंकिंग सक्रिय',
        rankingTooltipTitle: 'एआई स्मार्ट मैच कैसे काम करता है (PS 26089)',
        rankingFormula: 'स्कोर = 40% निकटता + 30% रेटिंग + 20% उपलब्धता + 10% कौशल मिलान',
        bookNow: 'सेवा बुक करें',
        available: 'उपलब्ध हैं',
        offline: 'ऑफलाइन',
        verifiedBadge: 'सहकारी सत्यापित सदस्य'
      },
      booking: {
        title: 'सेवा बुक करें',
        address: 'सेवा का पता',
        instructions: 'विशेष निर्देश / समस्या विवरण',
        date: 'निर्धारित समय व तारीख',
        confirm: 'बुकिंग की पुष्टि करें',
        transparentBreakdown: 'पारदर्शी भुगतान विवरण (SIH मॉडल)',
        directWorkerLabel: '80% सीधे श्रमिक को',
        coopFundLabel: '15% सहकारी कल्याण कोष',
        platformFeeLabel: '5% प्लेटफॉर्म रखरखाव शुल्क',
        totalPayable: 'कुल देय राशि',
        status: {
          REQUESTED: 'अनुरोधित',
          ACCEPTED: 'स्वीकृत',
          IN_PROGRESS: 'प्रगति पर',
          COMPLETED: 'पूर्ण',
          CANCELLED: 'रद्द',
          DISPUTED: 'विवादित'
        }
      },
      governance: {
        title: 'लोकतांत्रिक सहकारी शासन',
        subtitle: 'एक सदस्य, एक मत — हर श्रमिक के पास समान स्वामित्व और आवाज़।',
        openProposals: 'मतदान हेतु खुले प्रस्ताव',
        closedProposals: 'पूर्ण निर्णय एवं परिणाम',
        castVote: 'मतदान करें',
        voted: 'मत दर्ज हुआ',
        leadingChoice: 'वर्तमान अग्रणी विकल्प',
        totalVotes: 'कुल दर्ज मत',
        createProposal: 'नया प्रस्ताव बनाएं'
      },
      worker: {
        availability: 'कार्य उपलब्धता',
        online: 'ऑनलाइन (कार्य हेतु उपलब्ध)',
        offline: 'ऑफलाइन (विश्राम)',
        jobFeed: 'आगामी कार्य अनुरोध',
        accept: 'स्वीकार करें',
        decline: 'अस्वीकार करें',
        startJob: 'कार्य प्रारंभ करें',
        completeJob: 'कार्य पूर्ण करें व भुगतान प्राप्त करें',
        earningsTitle: 'व्यक्तिगत कमाई एवं सहकारी योगदान',
        totalEarned: 'कुल अर्जित राशि (80% प्रत्यक्ष)',
        coopContribution: 'सहकारी कोष में आपका योगदान (15%)',
        completedJobs: 'पूर्ण किए गए कार्य'
      },
      admin: {
        govOverview: 'राष्ट्रीय सहकारी निगरानी एवं वृहद विश्लेषण',
        coopDirectory: 'सहकारी समिति निर्देशिका एवं अनुमोदन',
        totalGmv: 'कुल प्लेटफॉर्म जीएमवी',
        totalPayouts: 'श्रमिकों को वितरित राशि',
        totalCoopFunds: 'सहकारी कल्याण आरक्षित निधि',
        demandCategory: 'श्रेणीवार मांग',
        demandDistrict: 'जिलेवार मांग',
        flaggedCoops: 'गुणवत्ता एवं विवाद निगरानी (चिह्नित समितियां)'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('sahakar_lang') || 'EN',
    fallbackLng: 'EN',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
