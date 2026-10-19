/* Conteúdo da LP de Parceiros — edite aqui, não no app.js. */

/* Formulário → HubSpot (mesmo formato das LPs do CV e do Diagnóstico de IA).
   HUBSPOT_FORM_ID vazio = envio simulado: nada sai da página (aparece um aviso no console). */
window.LEAD_CONFIG = {
  HUBSPOT_PORTAL_ID: "41468942",
  HUBSPOT_FORM_ID: "c2119563-dd07-462c-b640-b19328699490",  // "Landing Page Parceiros Oficiais - Contato" (clone do form do CV, 15/10/2026)
  CANAL: "Landing Page Parceiros Oficiais - Contato",       // morada_last_touch_channel padrão (= nome do formulário)
  PONTO: "lp_parceiros_especialista",                        // + "_<parceiro>" quando vem de um card/integração
  PONTO_SEJA_PARCEIRO: "lp_parceiros_seja_parceiro",
  GTM_ID: "GTM-WKLLFZGF",
  HOSTS_PRODUCAO: /(^|\.)morada\.ai$/i,                     // GTM e rastreio do HubSpot só carregam aqui
  TIMEOUT: 6000,
  EMAIL_ENDPOINT: "/api/send-email"                          // aviso por e-mail (Resend) — função em api/send-email.js; "" desliga
};

window.CATEGORIES = [
  { id: "crm",         label: "CRM" },
  { id: "erp",         label: "ERP" },
  { id: "financeiro",  label: "Financeiro" },
  { id: "implantacao", label: "Implantação" },
  { id: "portais",     label: "Portais" },
  { id: "marketing",   label: "Consultoria e marketing" },
  { id: "experiencia", label: "Experiência do cliente" }
];

window.STAGES = {
  pre:  "Pré-venda · Mia",
  conv: "Conversão · Sales",
  pos:  "Pós-venda · Iago",
  base: "Implantação · base de tudo"
};

/* short = linha do card (revisada); long = texto original do parceiro */
window.PARTNERS = [
  { slug: "cv-crm", name: "CV CRM", cat: "crm", stage: "pre", logo: "cvcrm-logo", integ: true,
    short: "Gestão do pré ao pós-venda para incorporadoras.",
    long: "Gestão inteligente do pré ao pós-venda." },
  { slug: "facilita-crm", name: "Facilita CRM", cat: "crm", stage: "pre", logo: "facilita-logo", integ: true,
    short: "CRM especializado em vendas imobiliárias.",
    long: "Acelere suas vendas com o CRM especializado." },
  { slug: "dommus", name: "Dommus", cat: "crm", stage: "pre", logo: "dommus-logo", integ: true,
    short: "CRM e gestão comercial para construtoras e incorporadoras.",
    long: "Uma ferramenta robusta para resultados extraordinários." },
  { slug: "multidados", name: "Multidados", cat: "crm", stage: "pre", logo: "multidados-logo",
    short: "CRM que une marketing, vendas e pós-venda, integrado a ERPs.",
    long: "A Multidados TI oferece soluções de CRM para construtoras e incorporadoras, integrando marketing, vendas e pós-venda com automação, inteligência artificial e integração com ERPs." },
  { slug: "senior-sistemas", name: "Sênior Sistemas", cat: "erp", stage: "pos", logo: "senior-sistemas-logo", integ: true,
    short: "ERP especialista em construção civil.",
    long: "O ERP especialista em construção civil." },
  { slug: "sienge", name: "Sienge", cat: "erp", stage: "pos", logo: "sienge-logo", integ: true,
    short: "Gestão de ponta a ponta para a construção.",
    long: "Gestão inteligente e de ponta a ponta para a construção." },
  { slug: "cub", name: "CUB", cat: "financeiro", stage: "pos", logo: "cub-logo",
    short: "Soluções financeiras para o mercado imobiliário.",
    long: "Soluções financeiras para o mercado imobiliário." },
  { slug: "resolutpay", name: "ResolutPay", cat: "financeiro", stage: "pos", logo: "resolutpay-logo",
    short: "Automatiza cobrança, pagamento e conciliação.",
    long: "A ResolutPay é uma plataforma de soluções financeiras para o mercado imobiliário, que automatiza cobranças, pagamentos, conciliações e gestão financeira." },
  { slug: "psa-sistemas", name: "PSA Sistemas", cat: "implantacao", stage: "base", logo: "psa-logo",
    short: "Hub de soluções para construtechs.",
    long: "Hub de Soluções para construtechs." },
  { slug: "pzr-sistemas", name: "PZR Sistemas", cat: "implantacao", stage: "base", logo: "pzr-logo",
    short: "Soluções do pré ao pós-obra.",
    long: "Soluções que vão do pré ao pós-obra." },
  { slug: "delta3-solucoes", name: "Delta3 Soluções", cat: "implantacao", stage: "base", logo: "delta3-solucoes-logo",
    short: "PSA, PZR e TCP juntos no Triângulo Mineiro.",
    long: "A Delta3 Soluções é uma parceria entre o Ecossistema PSA, PZR Sistemas e TCP Ecossistemas que une tecnologia integrada para levar inovação e eficiência à construção civil no Triângulo Mineiro." },
  { slug: "imovel-p", name: "Imóvel P", cat: "portais", stage: "pre", logo: "imovel-p-logo",
    short: "Conecta corretores a construtoras e proprietários.",
    long: "Conectando corretores a construtoras e proprietários." },
  { slug: "squad-realty", name: "Squad Realty", cat: "marketing", stage: "conv", logo: "squad-realty-logo",
    short: "Consultoria em estratégia e operação imobiliária.",
    long: "Consultoria especializada no mercado imobiliário para apoiar estratégia, operação e melhoria contínua." },
  { slug: "solomo", name: "Solomo", cat: "marketing", stage: "pre", logo: "solomo-logo",
    short: "Performance e estratégia digital para o imobiliário.",
    long: "Agência de marketing com foco em performance e estratégia digital para o mercado imobiliário." },
  { slug: "studio-61", name: "Studio 61", cat: "marketing", stage: "pre", logo: "studio61-logo",
    short: "Estratégia, criação e performance para vender imóveis.",
    long: "Agência de marketing digital para o mercado imobiliário. Estratégia, criação e performance com foco em resultados e vendas." },
  { slug: "vmv-group", name: "VMV Group", cat: "marketing", stage: "conv", logo: "vmv-group-logo",
    short: "Da viabilização ao lançamento e à gestão comercial.",
    long: "Apoiamos incorporadoras na criação, viabilização, lançamento e gestão comercial de empreendimentos em todo o Brasil, com dados, método e estratégia." },
  { slug: "upload", name: "Upload", cat: "marketing", stage: "pre", logo: "upload-logo",
    short: "Marketing digital para dar visibilidade ao seu negócio.",
    long: "Consultoria e estratégia de marketing digital para potencializar o crescimento e visibilidade do seu negócio imobiliário." },
  { slug: "play", name: "Play", cat: "marketing", stage: "conv", logo: "play-logo",
    short: "Organiza o processo comercial, do diagnóstico à secretaria de vendas.",
    long: "A Play organiza o processo comercial de incorporadoras, construtoras e loteadoras. Diagnóstico, CRM, gestão comercial e secretaria de vendas." },
  { slug: "skyline-ip", name: "Skyline IP", cat: "experiencia", stage: "conv", logo: "skyline-logo",
    short: "Soluções imersivas e interativas para vender imóveis.",
    long: "Soluções imersivas e interativas para o mercado imobiliário." },
  { slug: "arquiteto-de-bolso", name: "Arquiteto de Bolso", cat: "experiencia", stage: "conv", logo: "arquiteto-de-bolso-logo",
    short: "Arquitetos e designers de interiores para os ambientes.",
    long: "Transforme seus ambientes com arquitetos e designers de interiores experientes, por um preço acessível." },
  { slug: "atta-3d", name: "Atta 3D", cat: "experiencia", stage: "conv", logo: "atta-3d-logo",
    short: "Tours virtuais e salas imersivas para corretores e clientes.",
    long: "A ATTA 3D impulsiona vendas imobiliárias através de tours virtuais, salas imersivas e soluções interativas de marketing para corretores e clientes." },
  { slug: "facilitat", name: "Facilitat", cat: "experiencia", stage: "pos", logo: "facilitat-logo",
    short: "Assistência técnica, garantias e manutenção no pós-obra.",
    long: "A Facilitat é uma empresa de tecnologia que ajuda construtoras e incorporadoras a gerenciar o pós-obra, organizando chamados de assistência técnica, garantias dos imóveis e manutenções dos empreendimentos." }
];

window.JOURNEY = [
  { n: "01", tag: "Pré-venda", product: "Mia", img: "mia",
    title: "Atende, qualifica e entrega o lead pronto.",
    text: "A Mia conversa no WhatsApp, entende o que o cliente procura e registra tudo no seu CRM, sem duplicar o lead e sem atropelar o corretor que já atende.",
    caps: ["Consulta e cria leads no CRM", "Move o funil e ativa os gatilhos", "Agenda visita e deixa o relato da conversa"],
    partners: ["cv-crm", "facilita-crm", "dommus", "multidados", "imovel-p", "solomo", "studio-61", "upload"] },
  { n: "02", tag: "Conversão", product: "Sales", img: "sales",
    title: "O corretor vende com o contexto na mão.",
    text: "O Sales é o copiloto do time comercial: atualiza negócios, agenda reuniões, lembra o follow-up e responde dúvidas sobre empreendimentos e unidades.",
    caps: ["Negócios atualizados direto no CRM", "Agenda e lembretes sem lead esquecido", "Informação de produto na hora da conversa"],
    partners: ["play", "squad-realty", "vmv-group", "skyline-ip", "atta-3d", "arquiteto-de-bolso"] },
  { n: "03", tag: "Pós-venda", product: "Iago", img: "iago",
    title: "Depois da compra, o cliente continua atendido.",
    text: "O Iago identifica o cliente pelo CPF e resolve no chat o que antes virava ligação: boleto, extrato, saldo devedor e andamento da obra.",
    caps: ["2ª via de boleto no WhatsApp", "Extrato, saldo devedor e antecipação", "Andamento da obra a qualquer hora"],
    partners: ["sienge", "senior-sistemas", "cub", "resolutpay", "facilitat"] }
];

/* Funcionalidades das integrações nativas (fonte: páginas /parceiros/<slug>/integracoes) */
window.INTEGRATIONS = [
  { slug: "cv-crm", name: "CV CRM", modules: [
    { id: "Mia", role: "Pré-venda", items: [
      ["Consulta de leads", "Verifica se o lead já existe na base e não aciona corretor que já está em atendimento."],
      ["Criação de leads", "Cria leads do agente com nome, telefone e e-mail, usando só origens válidas do CV."],
      ["Movimentação de etapas", "Move o funil conforme as definições da Morada.ai e ativa os gatilhos do CV."],
      ["Atividades de visita", "Gera a tarefa de visita quando há interesse e o corretor já está atribuído."],
      ["Relatos e anotações", "Registra relatos em momentos-chave: apresentação, agendamento e transferência para humano."],
      ["Distribuição de leads", "Após a qualificação, solicita a distribuição para a fila certa, segmentada por produto."],
      ["Campos personalizados", "Preenche origem da campanha, produto, link da conversa, renda e motivo de descarte."],
      ["Anexos e documentos", "Inclui o link dos documentos quando há aprovação de crédito."],
      ["Roleta Morada.ai", "Usa a roleta de distribuição da Morada.ai, refletida nas configurações do CV."],
      ["Webhooks do CV", "O CV avisa a Mia quando um lead novo entra no funil e dispara mensagens por etapa."]
    ]},
    { id: "Sales", role: "Conversão", items: [
      ["Gestão de negócios", "Cria, atualiza, consulta e lista os negócios do corretor no CRM."],
      ["Reuniões e compromissos", "Agenda reuniões vinculadas ao lead e organiza a agenda do corretor."],
      ["Lembretes", "Garante o follow-up no tempo certo, sem lead esquecido."],
      ["Dados do lead", "Acessa as informações do lead transferido."],
      ["Engajamento de base", "Leva informação de empreendimentos e unidades para a base de corretores."]
    ]}
  ]},
  { slug: "facilita-crm", name: "Facilita CRM", modules: [
    { id: "Mia", role: "Pré-venda", items: [
      ["Ingestão por webhook", "Leads novos no Facilita entram na Mia para atendimento ativo no WhatsApp."],
      ["Busca e criação de leads", "Verifica se o lead existe: cria se não existir, atualiza se existir."],
      ["Qualificação e funil", "Atualiza a etapa do lead conforme a conversa avança."],
      ["Redistribuição", "Envia leads qualificados e não qualificados para filas específicas."],
      ["Agendamento de visitas", "Cria a tarefa de visita ao estande no perfil do lead."],
      ["Relato da qualificação", "Insere o resumo completo do atendimento no perfil do lead."],
      ["Tags customizadas", "Marca os negócios, como #mia-qualificado e #mia-nao-qualificado."],
      ["Responsável sincronizado", "Se o dono do lead muda no Facilita, a Mia acompanha."]
    ]},
    { id: "Sales", role: "Conversão", items: [
      ["Mapeamento de usuários", "Vincula o usuário do Sales ao corretor do Facilita: toda ação tem autor."],
      ["Criação segura de leads", "Bloqueia lead que já pertence a outro corretor e orienta falar com o gestor."],
      ["Busca de leads", "Pesquisa na base por nome, e-mail ou ID do dono."],
      ["Anotações e agenda", "Notas e agendamentos do Sales viram registros e tarefas no Facilita."],
      ["Movimentação de etapa", "Arrastar o card no Sales muda a etapa no Facilita."]
    ]}
  ]},
  { slug: "dommus", name: "Dommus", modules: [
    { id: "Mia", role: "Pré-venda", items: [
      ["Ingestão por webhook", "Lead que entra no Dommus vai para a Mia, com deduplicação por telefone, e-mail e ID."],
      ["Criação e sincronização", "Cria a oportunidade ou atualiza o empreendimento de interesse de um lead existente."],
      ["Mapeamento de origens", "Identifica de onde o lead veio (Facebook, Instagram, Google) e envia ao Dommus."],
      ["Movimentação de funil", "Atualiza a etapa conforme qualifica ou desqualifica o cliente."],
      ["Atribuição de corretores", "Lead qualificado ganha corretor; o não qualificado é redistribuído ou sinalizado."],
      ["Histórico de atendimento", "Envia o relatório da conversa como histórico do lead, em texto limpo."],
      ["Agendamento de visitas", "Cria a atividade de visita com data, hora, observações e corretor responsável."],
      ["Campos customizados", "Preenche os campos extras que a sua operação exige."]
    ]},
    { id: "Sales", role: "Conversão", items: [
      ["Etapa manual", "Card movido no Sales muda a etapa no funil do Dommus."],
      ["Agendamentos pelo Sales", "Visitas marcadas no Sales também criam a atividade no Dommus."],
      ["Logs e anotações", "Relatos gerados no Sales vão para o histórico do Dommus."]
    ]}
  ]},
  { slug: "senior-sistemas", name: "Sênior Sistemas", modules: [
    { id: "Iago", role: "Pós-venda", items: [
      ["Consulta de unidades", "Lista as unidades compradas pelo cliente a partir do CPF ou CNPJ."],
      ["2ª via de boletos", "Emite e envia boletos em aberto, com PDF e linha digitável."],
      ["Antecipação de parcelas", "Simula condições e gera boletos para antecipar."],
      ["Boletos em aberto", "Consulta as parcelas pendentes."],
      ["Extrato financeiro", "Mostra o demonstrativo de valores pagos."],
      ["Andamento de obras", "Informa a evolução e o status da obra."]
    ]}
  ]},
  { slug: "sienge", name: "Sienge", modules: [
    { id: "Iago", role: "Pós-venda", items: [
      ["Unidades adquiridas", "Identifica o cliente pelo CPF ou CNPJ e lista contratos, empreendimentos e unidades."],
      ["Parcelas em aberto", "Consulta valor, parcela e vencimento dos próximos pagamentos via API."],
      ["2ª via de boleto", "Busca o PDF e a linha digitável no Sienge e envia no WhatsApp."],
      ["Saldo devedor em PDF", "Gera o demonstrativo atualizado, protegido pelo CPF ou CNPJ do cliente."],
      ["Extrato por e-mail", "Comanda o Sienge a enviar o demonstrativo do contrato ao e-mail do cliente."]
    ]}
  ]}
];

/* Feed do hero: eventos reais que as integrações executam */
window.FEED = [
  { who: "Mia", what: "Lead qualificado no WhatsApp", where: "CV CRM", did: "etapa do funil atualizada" },
  { who: "Mia", what: "Visita agendada com o corretor", where: "Dommus", did: "atividade de visita criada" },
  { who: "Sales", what: "Follow-up do corretor lembrado", where: "Facilita CRM", did: "tarefa criada no perfil do lead" },
  { who: "Iago", what: "2ª via de boleto pedida no chat", where: "Sienge", did: "PDF e linha digitável enviados" },
  { who: "Mia", what: "Relato da conversa gerado", where: "CV CRM", did: "anotação registrada no lead" },
  { who: "Iago", what: "Andamento da obra consultado", where: "Sênior Sistemas", did: "status respondido no chat" },
  { who: "Sales", what: "Card movido pelo corretor", where: "Dommus", did: "etapa sincronizada" }
];
