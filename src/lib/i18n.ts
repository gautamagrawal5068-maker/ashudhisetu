import { Language } from '../types';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    'nav.dashboard': 'Dashboard',
    'nav.forecast': 'Forecasting',
    'nav.transfers': 'Transfers',
    'nav.upload': 'Upload Stock',
    'nav.login': 'Login',
    'nav.logout': 'Logout',
    'nav.settings': 'Settings',
    
    'landing.tagline': 'AI-powered medicine stock-out prevention for India\'s PHCs.',
    'landing.problem_statement': 'Preventing critical medicine shortages before they happen.',
    'landing.benefits': 'Smart Forecasting • Automated Transfers • Easy Register Digitization',
    'landing.try_demo': 'Try Demo',
    
    'phc.current_stock': 'Current Stock',
    'phc.low_stock_warning': 'Low Stock Warning',
    'phc.days_remaining': 'Days Remaining',
    'phc.update_stock': 'Update Stock',
    'phc.upload_register': 'Upload Register',
    
    'upload.image': 'Upload Register Image',
    'upload.preview': 'Image Preview',
    'upload.extracting': 'Extracting data...',
    'upload.confirm': 'Confirm Data',
    'upload.save': 'Save to Inventory',
    'upload.confidence': 'Confidence Score',
    'upload.mock_notice': 'Running in Mock Mode. Showing simulated extraction data.',
    
    'district.total_phcs': 'Total PHCs',
    'district.critical_risk': 'Critical Risk Centers',
    'district.medicines_at_risk': 'Medicines At Risk',
    'district.recommended_transfers': 'Recommended Transfers',
    'district.stock_outs_prevented': 'Stock-outs Prevented',
    'district.last_updated': 'Last Updated',
    
    'forecast.current_stock': 'Current Stock',
    'forecast.avg_consumption': 'Avg Consumption',
    'forecast.predicted_consumption': 'Predicted Daily Consumption',
    'forecast.days_remaining': 'Days Remaining',
    'forecast.stock_out_date': 'Predicted Stock Out',
    'forecast.risk_level': 'Risk Level',
    'forecast.safety_buffer': 'Safety Buffer',
    'forecast.delivery_lead_time': 'Delivery Lead Time',
    'forecast.seasonal_multiplier': 'Seasonal Multiplier',
    'forecast.footfall_multiplier': 'Footfall Multiplier',
    'forecast.explanation': 'AI Explanation',
    
    'transfer.from': 'From PHC',
    'transfer.to': 'To PHC',
    'transfer.quantity': 'Transfer Quantity',
    'transfer.urgency': 'Urgency',
    'transfer.approve': 'Approve',
    'transfer.reject': 'Reject',
    'transfer.reasoning': 'Recommendation Reasoning',
    
    'risk.Low': 'Low',
    'risk.Medium': 'Medium',
    'risk.High': 'High',
    'risk.Critical': 'Critical',
    
    'general.loading': 'Loading...',
    'general.error': 'An error occurred',
    'general.save': 'Save',
    'general.cancel': 'Cancel',
    'general.confirm': 'Confirm',
    'general.filter': 'Filter',
    'general.search': 'Search',
    'general.no_data': 'No data available',
    
    'notification.transfer_approved': 'Transfer approved successfully.',
    'notification.transfer_rejected': 'Transfer recommendation rejected.'
  },
  hi: {
    'nav.dashboard': 'डैशबोर्ड',
    'nav.forecast': 'पूर्वानुमान (Forecasting)',
    'nav.transfers': 'स्थानांतरण (Transfers)',
    'nav.upload': 'स्टॉक अपलोड',
    'nav.login': 'लॉग इन',
    'nav.logout': 'लॉग आउट',
    'nav.settings': 'सेटिंग्स',
    
    'landing.tagline': 'भारत के PHC के लिए AI-संचालित दवा स्टॉक-आउट रोकथाम।',
    'landing.problem_statement': 'गंभीर दवा की कमी को होने से पहले रोकना।',
    'landing.benefits': 'स्मार्ट पूर्वानुमान • स्वचालित स्थानांतरण • आसान रजिस्टर डिजिटलीकरण',
    'landing.try_demo': 'डेमो आज़माएं',
    
    'phc.current_stock': 'वर्तमान स्टॉक',
    'phc.low_stock_warning': 'कम स्टॉक की चेतावनी',
    'phc.days_remaining': 'शेष दिन',
    'phc.update_stock': 'स्टॉक अपडेट करें',
    'phc.upload_register': 'रजिस्टर अपलोड करें',
    
    'upload.image': 'रजिस्टर छवि अपलोड करें',
    'upload.preview': 'छवि पूर्वावलोकन',
    'upload.extracting': 'डेटा निकाला जा रहा है...',
    'upload.confirm': 'डेटा की पुष्टि करें',
    'upload.save': 'इन्वेंटरी में सहेजें',
    'upload.confidence': 'विश्वास स्कोर (Confidence)',
    'upload.mock_notice': 'मॉक मोड में चल रहा है। नकली निष्कर्षण डेटा दिखा रहा है।',
    
    'district.total_phcs': 'कुल PHC',
    'district.critical_risk': 'गंभीर जोखिम केंद्र',
    'district.medicines_at_risk': 'जोखिम में दवाएं',
    'district.recommended_transfers': 'अनुशंसित स्थानांतरण',
    'district.stock_outs_prevented': 'स्टॉक-आउट रोके गए',
    'district.last_updated': 'अंतिम अद्यतन',
    
    'forecast.current_stock': 'वर्तमान स्टॉक',
    'forecast.avg_consumption': 'औसत खपत',
    'forecast.predicted_consumption': 'अनुमानित दैनिक खपत',
    'forecast.days_remaining': 'शेष दिन',
    'forecast.stock_out_date': 'अनुमानित स्टॉक आउट',
    'forecast.risk_level': 'जोखिम स्तर',
    'forecast.safety_buffer': 'सुरक्षा बफर',
    'forecast.delivery_lead_time': 'वितरण समय',
    'forecast.seasonal_multiplier': 'मौसमी गुणक',
    'forecast.footfall_multiplier': 'फुटफॉल गुणक',
    'forecast.explanation': 'AI स्पष्टीकरण',
    
    'transfer.from': 'से (From PHC)',
    'transfer.to': 'तक (To PHC)',
    'transfer.quantity': 'स्थानांतरण मात्रा',
    'transfer.urgency': 'तात्कालिकता',
    'transfer.approve': 'मंजूर करें',
    'transfer.reject': 'अस्वीकार करें',
    'transfer.reasoning': 'सिफारिश का कारण',
    
    'risk.Low': 'कम',
    'risk.Medium': 'मध्यम',
    'risk.High': 'उच्च',
    'risk.Critical': 'गंभीर',
    
    'general.loading': 'लोड हो रहा है...',
    'general.error': 'एक त्रुटि हुई',
    'general.save': 'सहेजें',
    'general.cancel': 'रद्द करें',
    'general.confirm': 'पुष्टि करें',
    'general.filter': 'फ़िल्टर',
    'general.search': 'खोजें',
    'general.no_data': 'कोई डेटा उपलब्ध नहीं',
    
    'notification.transfer_approved': 'स्थानांतरण सफलतापूर्वक स्वीकृत।',
    'notification.transfer_rejected': 'स्थानांतरण सिफारिश अस्वीकार कर दी गई।'
  }
};

export function t(key: string, lang: Language): string {
  return translations[lang][key] || key;
}
