export interface TranslationGroup {
  original: string;
  translations: Record<string, string>;
  responseTemplate: Record<string, string>;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
];

export const TRANSLATIONS_DB: Record<string, TranslationGroup> = {
  restroom: {
    original: 'Where is the nearest restroom?',
    translations: {
      en: 'Where is the nearest restroom?',
      es: '¿Dónde está el baño más cercano?',
      fr: 'Où se trouvent les toilettes les plus proches ?',
      pt: 'Onde fica o banheiro mais próximo?',
      ar: 'أين هي أقرب دورة مياه؟',
    },
    responseTemplate: {
      en: 'The nearest restroom is located at Sector 115, which is 45 meters east. Follow the blue signs.',
      es: 'El baño más cercano está en el Sector 115, a 45 metros al este. Siga las señales azules.',
      fr: 'Les toilettes les plus proches sont situées dans le Secteur 115, à 45 mètres à l\'est. Suivez les panneaux bleus.',
      pt: 'O banheiro mais próximo está localizado no Setor 115, a 45 metros a leste. Siga as placas azuis.',
      ar: 'أقرب دورة مياه تقع في القطاع 115، على بعد 45 مترًا شرقًا. اتبع اللوحات الزرقاء.',
    },
  },
  medical: {
    original: 'I need medical assistance.',
    translations: {
      en: 'I need medical assistance.',
      es: 'Necesito asistencia médica.',
      fr: 'J\'ai besoin d\'une assistance médicale.',
      pt: 'Preciso de ajuda médica.',
      ar: 'أنا بحاجة إلى مساعدة طبية.',
    },
    responseTemplate: {
      en: 'Emergency Services notified. First Aid East is located in Sector 108. A volunteer has been dispatched to your current section.',
      es: 'Servicios de emergencia notificados. Primeros auxilios del este se encuentra en el Sector 108. Un voluntario ha sido enviado a su sección actual.',
      fr: 'Services d\'urgence notifiés. Le poste de premiers secours Est est situé dans le Secteur 108. Un bénévole a été envoyé dans votre section actuelle.',
      pt: 'Serviços de emergência notificados. O Posto de Primeiros Socorros Leste fica no Setor 108. Um voluntário foi enviado para a sua seção atual.',
      ar: 'تم إخطار خدمات الطوارئ. تقع الإسعافات الأولية الشرقية في القطاع 108. تم إرسال متطوع إلى قسمك الحالي.',
    },
  },
  metro: {
    original: 'How do I get to the Metro Station?',
    translations: {
      en: 'How do I get to the Metro Station?',
      es: '¿Cómo llego a la estación de metro?',
      fr: 'Comment aller à la station de métro ?',
      pt: 'Como faço para ir à estação de metrô?',
      ar: 'كيف أصل إلى محطة المترو؟',
    },
    responseTemplate: {
      en: 'Exit the stadium via Gate B (East Gates). The Metro Terminal (Exit 1) is a 3-minute walk straight ahead.',
      es: 'Salga del estadio por la Puerta B (Puertas Este). La Terminal del Metro (Salida 1) está a 3 minutos a pie recto.',
      fr: 'Sortez du stade par la Porte B (Portes Est). Le terminal de métro (Sortie 1) se trouve à 3 minutes à pied tout droit.',
      pt: 'Saia do estádio pelo Portão B (Portões Leste). O terminal de metrô (Saída 1) fica a 3 minutos a pé em frente.',
      ar: 'اخرج من الملعب عبر البوابة B (البوابات الشرقية). محطة المترو (المخرج 1) على بعد 3 دقائق سيرًا على الأقدام.',
    },
  },
  recycle: {
    original: 'Where can I recycle plastic cups?',
    translations: {
      en: 'Where can I recycle plastic cups?',
      es: '¿Dónde puedo reciclar los vasos de plástico?',
      fr: 'Où puis-je recycler les gobelets en plastique ?',
      pt: 'Onde posso reciclar os copos de plástico?',
      ar: 'أين يمكنني إعادة تدوير الأكواب البلاستيكية؟',
    },
    responseTemplate: {
      en: 'Please use the green Eco-Station bins located at Sector 101 or Sector 122. Bins are clearly labeled "Compost & Recyclables". Thank you for supporting FIFA Green Goals!',
      es: 'Utilice los contenedores verdes de la Eco-Estación ubicados en el Sector 101 o Sector 122. Tienen la etiqueta "Compost y Reciclables". ¡Gracias por apoyar los Objetivos Verdes de la FIFA!',
      fr: 'Veuillez utiliser les poubelles vertes de l\'Éco-Station situées dans le Secteur 101 ou le Secteur 122. Les poubelles portent la mention "Compost & Recyclables". Merci de soutenir les objectifs écologiques de la FIFA !',
      pt: 'Use as lixeiras verdes da Eco-Station localizadas no Setor 101 ou Setor 122. As lixeiras estão marcadas como "Composto e Recicláveis". Obrigado por apoiar as Metas Verdes da FIFA!',
      ar: 'يرجى استخدام حاويات المحطة البيئية الخضراء الواقعة في القطاع 101 أو القطاع 122. الحاويات مميزة بوضوح بـ "السماد والمواد القابلة لإعادة التدوير". شكرًا لدعمكم أهداف الفيفا الخضراء!',
    },
  },
  elevator: {
    original: 'Where is the nearest elevator for wheelchair access?',
    translations: {
      en: 'Where is the nearest elevator for wheelchair access?',
      es: '¿Dónde está el ascensor más cercano para personas en silla de ruedas?',
      fr: 'Où se trouve l\'ascenseur le plus proche pour l\'accès en fauteuil roulant ?',
      pt: 'Onde fica o elevador mais próximo para acesso de cadeira de rodas?',
      ar: 'أين هو أقرب مصعد للكراسي المتحركة؟',
    },
    responseTemplate: {
      en: 'The nearest accessible elevator is behind Section 112 (East side) or Section 136 (West side). All volunteers carry elevator priority badges to assist you.',
      es: 'El ascensor accesible más cercano está detrás de la Sección 112 (lado este) o de la Sección 136 (lado oeste). Todos los voluntarios tienen credenciales de prioridad de ascensor.',
      fr: 'L\'ascenseur accessible le plus proche se trouve derrière la Section 112 (côté Est) ou la Section 136 (côté Ouest). Tous les bénévoles portent des badges d\'accès prioritaire.',
      pt: 'O elevador acessível mais próximo fica atrás da Seção 112 (Lado Leste) ou da Seção 136 (Lado Oeste). Todos os voluntários têm crachás de prioridade no elevador.',
      ar: 'أقرب مصعد متاح للكراسي المتحركة يقع خلف القسم 112 (الجانب الشرقي) أو القسم 136 (الجانب الغربي). يحمل جميع المتطوعين شارات أولوية المصعد لمساعدتك.',
    },
  },
};
