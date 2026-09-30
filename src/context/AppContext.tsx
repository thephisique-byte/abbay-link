import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  User,
  SourcingRequest,
  Supplier,
  Quotation,
  Connection,
  Message,
  RequestStatus,
  SupplierVerificationStatus,
  AppNotification,
} from '../types';
import {
  CATEGORIES,
  REFERENCE_PRODUCTS,
  SUPPLIERS,
  DEMO_REQUESTS,
  DEMO_QUOTATIONS,
  DEMO_CONNECTIONS,
  DEMO_MESSAGES,
  DEMO_NOTIFICATIONS,
} from '../data/mockData';
import { Language, TRANSLATIONS } from '../i18n/translations';

interface AppContextType {
  // Language & i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS.en) => string;

  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentUser: User;
  setCurrentUser: (user: User) => void;

  // Authentication Modal & State
  isAuthOpen: boolean;
  openAuth: (mode?: 'login' | 'signup' | 'forgot') => void;
  closeAuth: () => void;
  authMode: 'login' | 'signup' | 'forgot';
  setAuthMode: (mode: 'login' | 'signup' | 'forgot') => void;
  loginUser: (emailOrPhone: string, role?: UserRole) => void;
  signupUser: (userData: { name: string; company: string; email: string; phone: string; role: UserRole; country: string; city: string }) => void;
  logoutUser: () => void;

  // Saved Sourcing Opportunities
  savedOpportunityIds: string[];
  toggleSaveOpportunity: (id: string) => void;

  // Notifications
  notifications: AppNotification[];
  addNotification: (title: string, message: string, type?: AppNotification['type'], requestId?: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Dashboard Sub-navigation
  buyerActiveSubTab: 'requests' | 'saved' | 'messages' | 'profile';
  setBuyerActiveSubTab: (tab: 'requests' | 'saved' | 'messages' | 'profile') => void;
  brokerActiveSubTab: 'overview' | 'requests' | 'matches' | 'suppliers' | 'quotes' | 'connections' | 'messages' | 'products' | 'categories' | 'fee';
  setBrokerActiveSubTab: (tab: 'overview' | 'requests' | 'matches' | 'suppliers' | 'quotes' | 'connections' | 'messages' | 'products' | 'categories' | 'fee') => void;

  // Requests
  requests: SourcingRequest[];
  addRequest: (
    reqData: Omit<
      SourcingRequest,
      'id' | 'createdAt' | 'updatedAt' | 'activityTimeline' | 'status' | 'matchedSupplierIds' | 'quotationIds'
    >
  ) => SourcingRequest;
  updateRequestStatus: (id: string, status: RequestStatus, note?: string) => void;
  addSupplierMatch: (requestId: string, supplierId: string, note?: string) => void;
  removeSupplierMatch: (requestId: string, supplierId: string) => void;
  updateBrokerNotes: (requestId: string, notes: string) => void;
  updateBrokerFee: (requestId: string, fee: SourcingRequest['brokerFee']) => void;

  // Suppliers
  suppliers: Supplier[];
  registerSupplier: (supData: Omit<Supplier, 'id' | 'status'>) => Supplier;
  updateSupplierStatus: (id: string, status: SupplierVerificationStatus) => void;

  // Quotations
  quotations: Quotation[];
  addQuotation: (quoteData: Omit<Quotation, 'id' | 'createdAt'>) => Quotation;

  // Connections
  connections: Connection[];
  requestConnection: (requestId: string, supplierId: string, notes?: string) => Connection;
  updateConnectionStatus: (connectionId: string, status: Connection['status']) => void;

  // Messages
  messages: Message[];
  sendMessage: (requestId: string, content: string, isInternal?: boolean) => void;

  // Navigation & Modals
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedRequestId: string | null;
  setSelectedRequestId: (id: string | null) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  openProductDetail: (id: string) => void;
  closeProductDetail: () => void;
  selectedCategoryFilter: string | null;
  setSelectedCategoryFilter: (cat: string | null) => void;
  selectedOriginFilter: string | null;
  setSelectedOriginFilter: (origin: string | null) => void;
  isPostRequestOpen: boolean;
  openPostRequest: (category?: string, productTitle?: string, specifications?: string) => void;
  closePostRequest: () => void;
  prefilledCategory: string;
  prefilledProduct: string;
  prefilledSpecs: string;
  isSupplierRegisterOpen: boolean;
  openSupplierRegister: () => void;
  closeSupplierRegister: () => void;
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  isProfileOpen: boolean;
  openProfile: () => void;
  closeProfile: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const USER_ROLES_PROFILES: Record<UserRole, User> = {
  buyer: {
    id: 'user-buyer-01',
    name: 'Alemayehu Tadesse',
    company: 'Awash Valley Agro Development PLC',
    email: 'alemayehu@awashagro.et',
    phone: '+251 91 123 4567',
    role: 'buyer',
    country: 'Ethiopia',
    city: 'Addis Ababa',
  },
  supplier: {
    id: 'user-sup-01',
    name: 'Murat Demir',
    company: 'Anadolu Flow Dynamics AS',
    email: 'mdemir@anadoluflow.example.com',
    phone: '+90 212 550 8820',
    role: 'supplier',
    country: 'Turkey',
    city: 'Istanbul',
  },
  broker: {
    id: 'user-broker-01',
    name: 'Henok Yohannes',
    company: 'ABAYLINK Sourcing & Brokerage Desk',
    email: 'henok@abaylink.com',
    phone: '+251 11 667 8900',
    role: 'broker',
    country: 'Ethiopia',
    city: 'Addis Ababa',
  },
  admin: {
    id: 'user-admin-01',
    name: 'System Admin',
    company: 'ABAYLINK HQ',
    email: 'admin@abaylink.com',
    phone: '+251 11 667 8900',
    role: 'admin',
    country: 'Ethiopia',
    city: 'Addis Ababa',
  },
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('abaylink_lang');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('abaylink_lang', lang);
  };

  const t = (key: keyof typeof TRANSLATIONS.en): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    return (dict as any)[key] || (TRANSLATIONS.en as any)[key] || String(key);
  };

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const saved = localStorage.getItem('abaylink_role');
    return (saved as UserRole) || 'buyer';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => USER_ROLES_PROFILES[currentRole]);

  const [requests, setRequests] = useState<SourcingRequest[]>(() => {
    const saved = localStorage.getItem('abaylink_requests');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_REQUESTS;
      }
    }
    return DEMO_REQUESTS;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('abaylink_suppliers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return SUPPLIERS;
      }
    }
    return SUPPLIERS;
  });

  const [quotations, setQuotations] = useState<Quotation[]>(() => {
    const saved = localStorage.getItem('abaylink_quotations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_QUOTATIONS;
      }
    }
    return DEMO_QUOTATIONS;
  });

  const [connections, setConnections] = useState<Connection[]>(() => {
    const saved = localStorage.getItem('abaylink_connections');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_CONNECTIONS;
      }
    }
    return DEMO_CONNECTIONS;
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('abaylink_messages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_MESSAGES;
      }
    }
    return DEMO_MESSAGES;
  });

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  const [selectedOriginFilter, setSelectedOriginFilter] = useState<string | null>(null);

  const openProductDetail = (id: string) => {
    setSelectedProductId(id);
  };

  const closeProductDetail = () => {
    setSelectedProductId(null);
  };

  const [isPostRequestOpen, setIsPostRequestOpen] = useState(false);
  const [prefilledCategory, setPrefilledCategory] = useState('');
  const [prefilledProduct, setPrefilledProduct] = useState('');
  const [prefilledSpecs, setPrefilledSpecs] = useState('');

  const [isSupplierRegisterOpen, setIsSupplierRegisterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Authentication states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');

  // Saved Opportunities
  const [savedOpportunityIds, setSavedOpportunityIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('abaylink_saved_opps');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ['REQ-2026-0841'];
      }
    }
    return ['REQ-2026-0841'];
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('abaylink_notifs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEMO_NOTIFICATIONS;
      }
    }
    return DEMO_NOTIFICATIONS;
  });

  // Dashboard Sub-navigation
  const [buyerActiveSubTab, setBuyerActiveSubTab] = useState<'requests' | 'saved' | 'messages' | 'profile'>('requests');
  const [brokerActiveSubTab, setBrokerActiveSubTab] = useState<'overview' | 'requests' | 'matches' | 'suppliers' | 'quotes' | 'connections' | 'messages' | 'products' | 'categories' | 'fee'>('overview');

  useEffect(() => {
    localStorage.setItem('abaylink_saved_opps', JSON.stringify(savedOpportunityIds));
  }, [savedOpportunityIds]);

  useEffect(() => {
    localStorage.setItem('abaylink_notifs', JSON.stringify(notifications));
  }, [notifications]);

  const openAuth = (mode: 'login' | 'signup' | 'forgot' = 'login') => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const closeAuth = () => {
    setIsAuthOpen(false);
  };

  const loginUser = (emailOrPhone: string, role?: UserRole) => {
    const matchedRole = role || (emailOrPhone.includes('sup') ? 'supplier' : emailOrPhone.includes('broker') ? 'broker' : emailOrPhone.includes('admin') ? 'admin' : 'buyer');
    setCurrentRole(matchedRole);
    setIsAuthOpen(false);
    addNotification('Logged In Successfully', `Welcome back to ABAYLINK as ${USER_ROLES_PROFILES[matchedRole].name}.`, 'status');
  };

  const signupUser = (userData: { name: string; company: string; email: string; phone: string; role: UserRole; country: string; city: string }) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      company: userData.company,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      country: userData.country,
      city: userData.city,
    };
    setCurrentUser(newUser);
    setCurrentRole(userData.role);
    setIsAuthOpen(false);
    addNotification('Account Created', `Your ${userData.role === 'buyer' ? 'Buyer' : 'Supplier'} account has been created on ABAYLINK.`, 'status');
  };

  const logoutUser = () => {
    setCurrentRole('buyer');
    addNotification('Signed Out', 'You have been signed out of your account.', 'status');
  };

  const toggleSaveOpportunity = (id: string) => {
    setSavedOpportunityIds((prev) => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter((item) => item !== id) : [...prev, id];
      addNotification(
        exists ? 'Removed from Saved' : 'Opportunity Saved',
        exists ? `Opportunity ${id} removed from your saved list.` : `Opportunity ${id} saved to your Buyer Workspace.`,
        'status',
        id
      );
      return updated;
    });
  };

  const addNotification = (title: string, message: string, type: AppNotification['type'] = 'status', requestId?: string) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      timestamp: 'Just now',
      type,
      requestId,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  useEffect(() => {
    localStorage.setItem('abaylink_role', currentRole);
    setCurrentUser(USER_ROLES_PROFILES[currentRole]);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('abaylink_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('abaylink_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('abaylink_quotations', JSON.stringify(quotations));
  }, [quotations]);

  useEffect(() => {
    localStorage.setItem('abaylink_connections', JSON.stringify(connections));
  }, [connections]);

  useEffect(() => {
    localStorage.setItem('abaylink_messages', JSON.stringify(messages));
  }, [messages]);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
  };

  const openPostRequest = (category?: string, productTitle?: string, specifications?: string) => {
    setPrefilledCategory(category || '');
    setPrefilledProduct(productTitle || '');
    setPrefilledSpecs(specifications || '');
    setIsPostRequestOpen(true);
  };

  const closePostRequest = () => {
    setIsPostRequestOpen(false);
    setPrefilledCategory('');
    setPrefilledProduct('');
    setPrefilledSpecs('');
  };

  const openSupplierRegister = () => setIsSupplierRegisterOpen(true);
  const closeSupplierRegister = () => setIsSupplierRegisterOpen(false);
  const openSearch = () => setIsSearchOpen(true);
  const closeSearch = () => setIsSearchOpen(false);
  const openProfile = () => setIsProfileOpen(true);
  const closeProfile = () => setIsProfileOpen(false);

  const addRequest = (
    reqData: Omit<
      SourcingRequest,
      'id' | 'createdAt' | 'updatedAt' | 'activityTimeline' | 'status' | 'matchedSupplierIds' | 'quotationIds'
    >
  ): SourcingRequest => {
    const nextNum = Math.floor(1000 + Math.random() * 9000);
    const newReqId = `REQ-2026-${nextNum}`;
    const now = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newRequest: SourcingRequest = {
      ...reqData,
      id: newReqId,
      status: 'Submitted',
      createdAt: now,
      updatedAt: now,
      matchedSupplierIds: [],
      quotationIds: [],
      activityTimeline: [
        {
          id: `act-${Date.now()}`,
          title: 'Request Submitted',
          timestamp: formattedDate,
          note: `Sourcing request submitted by ${reqData.buyerCompany || reqData.buyerName}.`,
          status: 'Submitted',
        },
      ],
    };

    setRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  };

  const updateRequestStatus = (id: string, status: RequestStatus, note?: string) => {
    const now = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== id) return req;
        return {
          ...req,
          status,
          updatedAt: now,
          activityTimeline: [
            ...req.activityTimeline,
            {
              id: `act-${Date.now()}`,
              title: `Status: ${status}`,
              timestamp: formattedDate,
              note: note || `Request progressed to ${status}.`,
              status,
            },
          ],
        };
      })
    );
  };

  const addSupplierMatch = (requestId: string, supplierId: string, note?: string) => {
    const formattedDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
    const sup = suppliers.find((s) => s.id === supplierId);

    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        if (req.matchedSupplierIds.includes(supplierId)) return req;

        const newMatches = [...req.matchedSupplierIds, supplierId];
        const newStatus = req.status === 'Submitted' || req.status === 'Under Review' ? 'Supplier Matched' : req.status;

        return {
          ...req,
          matchedSupplierIds: newMatches,
          status: newStatus,
          activityTimeline: [
            ...req.activityTimeline,
            {
              id: `act-${Date.now()}`,
              title: `Supplier Matched: ${sup ? sup.name : supplierId}`,
              timestamp: formattedDate,
              note: note || `ABAYLINK added ${sup?.name || 'supplier'} (${sup?.country || ''}) as a potential match.`,
              status: 'Supplier Matched',
            },
          ],
        };
      })
    );
  };

  const removeSupplierMatch = (requestId: string, supplierId: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          matchedSupplierIds: req.matchedSupplierIds.filter((id) => id !== supplierId),
        };
      })
    );
  };

  const updateBrokerNotes = (requestId: string, notes: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, brokerNotes: notes, updatedAt: new Date().toISOString() } : req))
    );
  };

  const updateBrokerFee = (requestId: string, fee: SourcingRequest['brokerFee']) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === requestId ? { ...req, brokerFee: fee, updatedAt: new Date().toISOString() } : req))
    );
  };

  const registerSupplier = (supData: Omit<Supplier, 'id' | 'status'>): Supplier => {
    const newId = `sup-reg-${Date.now()}`;
    const newSup: Supplier = {
      ...supData,
      id: newId,
      status: 'Under Review',
    };
    setSuppliers((prev) => [newSup, ...prev]);
    return newSup;
  };

  const updateSupplierStatus = (id: string, status: SupplierVerificationStatus) => {
    setSuppliers((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const addQuotation = (quoteData: Omit<Quotation, 'id' | 'createdAt'>): Quotation => {
    const newId = `quote-${Date.now()}`;
    const newQuote: Quotation = {
      ...quoteData,
      id: newId,
      createdAt: new Date().toISOString(),
    };

    setQuotations((prev) => [newQuote, ...prev]);

    // Attach to request
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== quoteData.requestId) return req;
        const nextQuotes = [...req.quotationIds, newId];
        return {
          ...req,
          quotationIds: nextQuotes,
          status: 'Quotation Received',
          activityTimeline: [
            ...req.activityTimeline,
            {
              id: `act-${Date.now()}`,
              title: `Quotation Received: ${quoteData.supplierName}`,
              timestamp: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              }),
              note: `Formal quote of ${quoteData.currency} ${quoteData.unitPrice}/unit recorded for buyer review.`,
              status: 'Quotation Received',
            },
          ],
        };
      })
    );

    return newQuote;
  };

  const requestConnection = (requestId: string, supplierId: string, notes?: string): Connection => {
    const req = requests.find((r) => r.id === requestId);
    const sup = suppliers.find((s) => s.id === supplierId);

    const newConn: Connection = {
      id: `conn-${Date.now()}`,
      requestId,
      requestTitle: req?.title || 'Sourcing Requirement',
      buyerId: req?.buyerId || currentUser.id,
      buyerName: req?.buyerName || currentUser.name,
      buyerCompany: req?.buyerCompany || currentUser.company,
      supplierId,
      supplierName: sup?.name || 'Global Supplier',
      supplierCountry: sup?.country || 'International',
      status: 'Connection Requested',
      createdAt: new Date().toISOString(),
      notes,
    };

    setConnections((prev) => [newConn, ...prev]);

    // Update request state
    updateRequestStatus(requestId, 'Connected', `Buyer requested introduction with ${sup?.name || 'supplier'}.`);

    return newConn;
  };

  const updateConnectionStatus = (connectionId: string, status: Connection['status']) => {
    setConnections((prev) => prev.map((c) => (c.id === connectionId ? { ...c, status } : c)));
  };

  const sendMessage = (requestId: string, content: string, isInternal = false) => {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      requestId,
      senderId: currentUser.id,
      senderName: currentRole === 'broker' ? 'ABAYLINK Sourcing Desk' : currentUser.name,
      senderRole: currentRole,
      content,
      timestamp: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      isInternal,
    };

    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        currentRole,
        setCurrentRole: (role: UserRole) => {
          setCurrentRoleState(role);
        },
        currentUser,
        setCurrentUser,
        isAuthOpen,
        openAuth,
        closeAuth,
        authMode,
        setAuthMode,
        loginUser,
        signupUser,
        logoutUser,
        savedOpportunityIds,
        toggleSaveOpportunity,
        notifications,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications,
        buyerActiveSubTab,
        setBuyerActiveSubTab,
        brokerActiveSubTab,
        setBrokerActiveSubTab,
        requests,
        addRequest,
        updateRequestStatus,
        addSupplierMatch,
        removeSupplierMatch,
        updateBrokerNotes,
        updateBrokerFee,
        suppliers,
        registerSupplier,
        updateSupplierStatus,
        quotations,
        addQuotation,
        connections,
        requestConnection,
        updateConnectionStatus,
        messages,
        sendMessage,
        activeTab,
        setActiveTab,
        selectedRequestId,
        setSelectedRequestId,
        selectedProductId,
        setSelectedProductId,
        openProductDetail,
        closeProductDetail,
        selectedCategoryFilter,
        setSelectedCategoryFilter,
        selectedOriginFilter,
        setSelectedOriginFilter,
        isPostRequestOpen,
        openPostRequest,
        closePostRequest,
        prefilledCategory,
        prefilledProduct,
        prefilledSpecs,
        isSupplierRegisterOpen,
        openSupplierRegister,
        closeSupplierRegister,
        isSearchOpen,
        openSearch,
        closeSearch,
        isProfileOpen,
        openProfile,
        closeProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
