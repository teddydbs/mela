import type { Lesson, CategoryId } from '@/lib/types';

// Note: 11 more category lessons will be added (articles, quantifiers, etc.).
// Cast at the bottom of the file so existing call sites keep their non-nullable type.
const LESSONS_RAW = {
  tenses: {
    intro:
      "Les temps verbaux représentent ton plus gros gap actuel. Une fois maîtrisés, tu sautes de A2 à B1 sans effort. Règle d'or : ne traduis pas du français, raisonne en logique anglaise.",
    sections: [
      {
        title: "1. Past Simple — l'action terminée",
        rule:
          "Pour une action complètement terminée dans le passé, avec un moment précis. C'est l'équivalent du passé composé en français.",
        examples: [
          { en: 'I went to Paris last summer.', fr: "Je suis allé à Paris l'été dernier." },
          { en: 'She bought a new car in 2023.', fr: 'Elle a acheté une nouvelle voiture en 2023.' },
          { en: 'We had dinner yesterday at 8pm.', fr: 'On a dîné hier à 20h.' },
        ],
        markers: { label: 'Marqueurs typiques', items: ['yesterday', 'last week/year', 'in 2020', '3 days ago', 'when I was...'] },
      },
      {
        title: '2. Present Perfect — le pont passé / présent',
        rule:
          "Quand l'action a un lien avec MAINTENANT : soit elle continue, soit le résultat est encore visible, soit la période n'est pas terminée. C'est LE temps que les francophones ratent le plus.",
        examples: [
          { en: 'I have lived in Bordeaux for 5 years.', fr: "Je vis à Bordeaux depuis 5 ans (et j'y suis encore)." },
          { en: 'She has just finished her report.', fr: 'Elle vient de finir son rapport.' },
          { en: 'I have been to Japan twice.', fr: 'Je suis allé au Japon deux fois (dans ma vie).' },
        ],
        markers: { label: 'Marqueurs typiques', items: ['for X years', 'since 2020', 'ever', 'never', 'already', 'just', 'yet', 'this year'] },
        warning:
          "PIÈGE : 'I have been to Japan' = je suis allé (et revenu). 'I have gone to Japan' = je suis parti (et j'y suis encore). À ne pas confondre.",
      },
      {
        title: "3. Past Perfect — l'antériorité passée",
        rule:
          'Quand tu as 2 actions passées et que tu veux préciser laquelle est arrivée en PREMIER. Structure : had + participe passé.',
        examples: [
          { en: 'When I arrived, they had already left.', fr: 'Quand je suis arrivé, ils étaient déjà partis.' },
          { en: 'She had studied 3 years before moving to Paris.', fr: 'Elle avait étudié 3 ans avant de déménager à Paris.' },
        ],
        warning:
          "Tu n'en as besoin QUE pour préciser un ordre chronologique entre 2 actions passées. Sinon, past simple suffit.",
      },
      {
        title: "4. Future Perfect — l'action terminée dans le futur",
        rule:
          "Pour dire qu'une action sera DÉJÀ terminée à un moment précis du futur. Structure : will have + participe passé.",
        examples: [
          { en: 'By next June, I will have worked here for 5 years.', fr: "D'ici juin prochain, j'aurai travaillé ici 5 ans." },
          { en: 'By the time you read this, I will have left.', fr: 'Quand tu liras ça, je serai déjà parti.' },
        ],
        markers: { label: 'Marqueurs typiques', items: ['by next year', 'by the time...', 'by 2030', 'by then'] },
      },
    ],
  },
  modals: {
    intro:
      "Les modaux expriment des nuances que le français rend avec 'devoir', 'pouvoir', 'falloir'. Le problème : un seul verbe français = 3-4 modaux anglais selon le contexte.",
    sections: [
      {
        title: "1. Must vs Have to — l'obligation",
        rule:
          "Les deux veulent dire 'devoir', mais : must = obligation que tu t'imposes / have to = obligation imposée de l'extérieur.",
        examples: [
          { en: 'I must finish this report tonight.', fr: 'Je dois finir ce rapport ce soir (je me le dis).' },
          { en: 'I have to wear a tie at work.', fr: "Je dois porter une cravate (mon patron l'impose)." },
        ],
        warning: "Au passé, 'must' n'existe pas. On utilise toujours 'had to' : 'I had to leave early yesterday'.",
      },
      {
        title: "2. Mustn't vs Don't have to — LE PIÈGE",
        rule: 'Attention danger : ces deux formes veulent dire DEUX choses opposées !',
        examples: [
          { en: "You mustn't smoke here.", fr: "Tu n'as PAS LE DROIT de fumer (interdit)." },
          { en: "You don't have to come.", fr: "Tu N'ES PAS OBLIGÉ de venir (mais tu peux)." },
        ],
        warning: "C'est l'erreur #1 des francophones. Mémorise : MUSTN'T = INTERDIT, DON'T HAVE TO = PAS OBLIGATOIRE.",
      },
      {
        title: '3. Should — le conseil',
        rule: "Should = 'devrais'. Plus doux que 'must'. Pour un conseil ou une recommandation.",
        examples: [
          { en: 'You should see a doctor.', fr: 'Tu devrais voir un médecin.' },
          { en: 'We should leave early.', fr: 'On devrait partir tôt.' },
        ],
      },
      {
        title: '4. Can / Could — capacité, permission',
        rule: 'Can = au présent. Could = au passé, OU demande polie au présent.',
        examples: [
          { en: 'I can speak Spanish.', fr: 'Je sais parler espagnol.' },
          { en: 'Could you help me?', fr: "Pourriez-vous m'aider ? (poli)" },
          { en: 'When I was 10, I could swim.', fr: 'À 10 ans, je savais nager.' },
        ],
      },
      {
        title: '5. Might / May — la possibilité',
        rule: 'Might = peut-être (incertain). May = identique, légèrement plus formel.',
        examples: [
          { en: 'It might rain tomorrow.', fr: 'Il va peut-être pleuvoir.' },
          { en: 'She may be in a meeting.', fr: 'Elle est peut-être en réunion.' },
        ],
      },
      {
        title: '6. Modal + HAVE + participe passé',
        rule: 'Pour DÉDUIRE ou REGRETTER sur le passé. Structure : modal + have + participe passé.',
        examples: [
          { en: 'He must have forgotten.', fr: 'Il a forcément oublié (déduction certaine).' },
          { en: 'You should have called me!', fr: "Tu aurais dû m'appeler ! (reproche)" },
          { en: 'She might have missed the train.', fr: 'Elle a peut-être raté le train.' },
        ],
      },
    ],
  },
  conditionals: {
    intro:
      "5 types de conditionnels existent, mais en pratique tu en utilises surtout 3. La clé : pose-toi la question — je parle du présent, du futur, ou du passé hypothétique ?",
    sections: [
      {
        title: '1. Zero Conditional — vérités générales',
        rule: 'Pour les faits scientifiques ou vérités universelles. Structure : IF + présent, présent.',
        examples: [
          { en: 'If you heat water to 100°C, it boils.', fr: 'Si tu chauffes l’eau à 100°C, elle bout.' },
          { en: "If I don't sleep enough, I get tired.", fr: 'Si je ne dors pas assez, je suis fatigué.' },
        ],
      },
      {
        title: '2. First Conditional — futur probable',
        rule: "Pour un événement futur réaliste. Structure : IF + présent simple, WILL + base verbale.",
        examples: [
          { en: 'If it rains tomorrow, I will stay home.', fr: "S'il pleut demain, je resterai à la maison." },
          { en: 'If you study, you will pass the exam.', fr: 'Si tu étudies, tu réussiras l’examen.' },
        ],
        warning: "JAMAIS de 'will' dans la partie 'if'. Pas 'If it will rain' — c'est 'If it rains'.",
      },
      {
        title: '3. Second Conditional — hypothèse présente irréelle',
        rule: 'Pour une situation présente imaginaire. Structure : IF + past simple, WOULD + base verbale.',
        examples: [
          { en: 'If I had more money, I would travel.', fr: "Si j'avais plus d'argent, je voyagerais." },
          { en: 'If I were you, I would take the job.', fr: "Si j'étais toi, j'accepterais le poste." },
        ],
        warning: "Avec 'be', on utilise 'were' à toutes les personnes : 'If I WERE rich'. C'est un subjonctif.",
      },
      {
        title: '4. Third Conditional — le regret passé',
        rule: "Pour un passé qu'on aurait voulu différent. Structure : IF + past perfect, WOULD HAVE + participe passé.",
        examples: [
          { en: 'If I had known, I would have come.', fr: "Si j'avais su, je serais venu." },
          { en: 'If she had studied harder, she would have passed.', fr: 'Si elle avait plus étudié, elle aurait réussi.' },
        ],
      },
      {
        title: '5. Mixed Conditional — passé → présent',
        rule: 'Condition passée qui affecte le présent. Structure : IF + past perfect, WOULD + base verbale.',
        examples: [
          { en: 'If I had taken that job, I would live in NY now.', fr: 'Si j’avais pris ce poste, je vivrais à NY maintenant.' },
        ],
      },
    ],
  },
  gerunds: {
    intro:
      "Le piège classique. En français : 'J'ai décidé DE partir' / 'J'aime LIRE' — toujours un infinitif. En anglais, c'est soit TO + base verbale, soit verbe + ING. À mémoriser pour chaque verbe.",
    sections: [
      {
        title: '1. Verbes suivis de -ING',
        rule: 'Ces verbes très courants prennent toujours -ING après eux.',
        examples: [
          { en: 'I enjoy reading.', fr: "J'aime lire." },
          { en: 'She suggested trying a new approach.', fr: "Elle a suggéré d'essayer." },
          { en: 'He avoids talking about it.', fr: "Il évite d'en parler." },
          { en: 'I look forward to seeing you.', fr: "J'ai hâte de te voir." },
        ],
        markers: {
          label: 'À mémoriser absolument',
          items: ['enjoy', 'mind', 'suggest', 'avoid', 'finish', 'keep', 'look forward to', "can't help", 'give up', 'consider'],
        },
      },
      {
        title: '2. Verbes suivis de TO + base verbale',
        rule: 'Ces verbes prennent toujours TO + infinitif.',
        examples: [
          { en: 'I decided to leave.', fr: "J'ai décidé de partir." },
          { en: 'She refused to sign.', fr: 'Elle a refusé de signer.' },
          { en: 'He promised to call.', fr: "Il a promis d'appeler." },
        ],
        markers: {
          label: 'À mémoriser absolument',
          items: ['decide', 'want', 'need', 'refuse', 'promise', 'manage', 'agree', 'hope', 'plan', 'offer'],
        },
      },
      {
        title: '3. Verbes qui changent de sens — PIÈGE',
        rule: 'Certains verbes acceptent les deux formes, MAIS le sens change.',
        examples: [
          { en: 'I stopped smoking.', fr: "J'ai arrêté de fumer." },
          { en: 'I stopped to smoke.', fr: 'Je me suis arrêté POUR fumer.' },
          { en: 'I remember meeting him.', fr: "Je me souviens de l'avoir rencontré." },
          { en: 'I remember to lock the door.', fr: 'Je pense à fermer la porte (futur).' },
        ],
        warning: 'Les 4 verbes à connaître : STOP, REMEMBER, FORGET, TRY. Le sens dépend de la construction.',
      },
      {
        title: "4. Préposition + ING (règle d'or)",
        rule: "Après une préposition (in, on, at, for, about, before, after, to-préposition...) c'est TOUJOURS -ING.",
        examples: [
          { en: "I'm interested in learning Japanese.", fr: 'Je suis intéressé par l’apprentissage du japonais.' },
          { en: 'Before leaving, lock the door.', fr: 'Avant de partir, ferme la porte.' },
          { en: "She's good at cooking.", fr: 'Elle est douée pour cuisiner.' },
        ],
        warning:
          "Le 'TO' de 'look forward TO' est une préposition, pas un infinitif. Donc -ING derrière. Idem 'be used TO + ing'.",
      },
    ],
  },
  prepositions: {
    intro:
      "Les prépositions ne se traduisent JAMAIS directement. 'Married TO' pas 'with'. 'Arrive IN' pas 'to'. Pas de logique pure — il faut mémoriser. Voici les pièges les plus courants pour les francophones.",
    sections: [
      {
        title: '1. AT / IN / ON — pour les lieux',
        rule: 'AT = point précis. IN = à l’intérieur. ON = sur une surface.',
        examples: [
          { en: "I'm AT the airport.", fr: 'Je suis à l’aéroport (point de rendez-vous).' },
          { en: "I'm IN the airport.", fr: 'Je suis dans l’aéroport (à l’intérieur du bâtiment).' },
          { en: 'The book is ON the table.', fr: 'Le livre est sur la table.' },
          { en: 'I live IN Bordeaux.', fr: 'Je vis à Bordeaux (ville/pays = IN).' },
          { en: 'I live AT 12 Rue de Paris.', fr: 'Adresse précise = AT.' },
        ],
      },
      {
        title: '2. AT / IN / ON — pour le temps',
        rule: 'AT = heure précise. ON = jour précis. IN = mois, année, saison, période longue.',
        examples: [
          { en: "AT 8 o'clock / AT noon / AT midnight", fr: 'Heures précises.' },
          { en: 'ON Monday / ON July 4th / ON Christmas Day', fr: 'Jours précis.' },
          { en: 'IN July / IN 2024 / IN winter / IN the morning', fr: 'Périodes plus longues.' },
        ],
      },
      {
        title: '3. Verbes + préposition (à mémoriser)',
        rule: "Ces combinaisons sont figées. Pas de logique, juste à apprendre par cœur.",
        examples: [
          { en: 'depend ON', fr: 'dépendre de' },
          { en: 'listen TO', fr: 'écouter' },
          { en: 'look FOR', fr: 'chercher' },
          { en: 'look AT', fr: 'regarder' },
          { en: 'look AFTER', fr: "s'occuper de" },
          { en: 'apologize FOR', fr: "s'excuser de" },
          { en: 'wait FOR', fr: 'attendre' },
        ],
      },
      {
        title: '4. Adjectifs + préposition',
        rule: 'Les adjectifs aussi ont leurs prépositions fixes.',
        examples: [
          { en: 'interested IN', fr: 'intéressé par' },
          { en: 'good AT', fr: 'doué pour' },
          { en: 'afraid OF', fr: 'avoir peur de' },
          { en: 'married TO', fr: 'marié à/avec' },
          { en: 'responsible FOR', fr: 'responsable de' },
          { en: 'dependent ON', fr: 'dépendant de' },
        ],
      },
      {
        title: '5. Top 6 pièges francophones',
        rule: 'Les erreurs les plus fréquentes — apprends-les par cœur.',
        examples: [
          { en: "She's married TO him.", fr: "Pas 'with' !" },
          { en: 'I arrived IN Paris.', fr: "Pas 'to' ni 'at' pour une ville." },
          { en: "I'm good AT math.", fr: "Pas 'in'." },
          { en: "I'm afraid OF spiders.", fr: "Pas 'from'." },
          { en: 'Congratulations ON your promotion!', fr: "Pas 'for'." },
          { en: 'Responsible FOR the team.', fr: "Pas 'of'." },
        ],
      },
    ],
  },
  articles: {
    intro:
      "L'article est le piège #1 du francophone. En français on dit 'LA vie', 'LE café' partout. En anglais, on a 3 choix : 'a/an' (un, premier mention), 'the' (le, spécifique) ou Ø (rien du tout). Maîtriser ça = bond énorme vers le naturel.",
    sections: [
      {
        title: '1. a vs an — le SON décide',
        rule: "Devant un mot qui commence par un SON voyelle → 'an'. Devant un son consonne → 'a'. C'est le SON, pas la LETTRE, qui compte.",
        examples: [
          { en: 'an apple, an hour, an honest man', fr: "Sons voyelles (h muet dans 'hour'/'honest')." },
          { en: 'a university, a European, a one-way ticket', fr: "Sons consonnes : 'university' = [you-niversity]." },
          { en: 'a car, an SUV, an X-ray', fr: "'SUV' = [es-yoo-vee], 'X-ray' = [ex-ray] — sons voyelles." },
        ],
        warning: "Devant les abréviations, c'est le SON de la première lettre qui compte : 'an MBA' (em), 'a UFO' (you).",
      },
      {
        title: "2. The — quand c'est UNIQUE ou SPÉCIFIQUE",
        rule: "Utilise 'the' pour : (1) un objet unique au monde, (2) quelque chose déjà mentionné, (3) le superlatif, (4) un détail spécifique connu des deux interlocuteurs.",
        examples: [
          { en: 'The sun is hot today.', fr: 'Unique au monde.' },
          { en: 'I bought a car. The car is red.', fr: 'Déjà mentionné — la 2e fois on précise.' },
          { en: 'She is the best player.', fr: 'Superlatif → toujours the.' },
          { en: 'The book on the table is mine.', fr: 'Spécifique (lequel ? celui sur la table).' },
        ],
      },
      {
        title: '3. Ø (zéro article) — généralités et abstraits',
        rule: "Pas d'article devant : (1) noms abstraits généraux, (2) noms au pluriel généraux, (3) repas, langues, sports, (4) noms propres (la plupart).",
        examples: [
          { en: 'Life is beautiful.', fr: 'Pas LA vie (général/abstrait).' },
          { en: 'I love coffee and music.', fr: 'Général, pas spécifique.' },
          { en: 'I have lunch at noon.', fr: 'Repas, pas de the.' },
          { en: 'She speaks French and plays football.', fr: 'Langues et sports = Ø.' },
        ],
        warning: "Piège FR : on dit 'LE café' en français mais 'I love coffee' en anglais.",
      },
      {
        title: '4. Pays, lieux et institutions',
        rule: "La plupart des pays : Ø article. Sauf : pays au PLURIEL, avec 'Of', 'Republic', 'Union' → 'the'. Pareil pour les institutions célèbres.",
        examples: [
          { en: 'I went to France, Japan, Australia.', fr: 'Pays simples = Ø.' },
          { en: 'She lives in the UK, the USA, the Netherlands.', fr: 'Pluriels ou composés = the.' },
          { en: 'The Eiffel Tower, the White House, the Louvre.', fr: 'Monuments célèbres = the.' },
          { en: 'I go to bed / to work / to school / to church.', fr: 'Institutions abstraites = Ø.' },
        ],
      },
      {
        title: '5. Métiers, maladies, expressions figées',
        rule: "Métiers : TOUJOURS a/an (≠ français). Maladies courantes : a/an (a cold, a fever, a headache). Mais 'the flu', 'the measles'.",
        examples: [
          { en: 'She is a doctor.', fr: 'Pas \"She is doctor\" — piège FR.' },
          { en: 'He has a cold and a headache.', fr: 'Maladies courantes = a.' },
          { en: "I'm getting the flu.", fr: 'Grippe = exception, the flu.' },
        ],
      },
    ],
  },
  quantifiers: {
    intro:
      "Quantifier en anglais = choisir le BON mot selon que ton nom est dénombrable (countable, on peut compter 1, 2, 3) ou indénombrable (uncountable : eau, argent, temps). Faux pas = sonner non-natif immédiat.",
    sections: [
      {
        title: '1. Some / Any — la base',
        rule: "'Some' aux phrases AFFIRMATIVES + dans les offres polies. 'Any' aux NÉGATIONS et QUESTIONS neutres.",
        examples: [
          { en: 'I have some friends in Sydney.', fr: 'Affirmatif → some.' },
          { en: 'Do you have any questions?', fr: 'Question neutre → any.' },
          { en: "I don't have any time today.", fr: 'Négation → any.' },
          { en: 'Would you like some tea?', fr: 'Offre polie → some (même en question).' },
        ],
        warning: "'Any' au sens POSITIF peut aussi vouloir dire 'n'importe lequel' : 'Take any seat' = prends n'importe quelle place.",
      },
      {
        title: '2. Much / Many — la grande règle',
        rule: "'Much' avec INDÉNOMBRABLES (water, money, time, advice, information). 'Many' avec DÉNOMBRABLES PLURIELS (books, friends, cars). À l'affirmatif, préférer 'a lot of'.",
        examples: [
          { en: 'How much money do you have?', fr: 'money = indénombrable.' },
          { en: 'How many friends do you have?', fr: 'friends = dénombrable.' },
          { en: "I don't have much time.", fr: 'Négatif + indénombrable.' },
          { en: 'I have a lot of books.', fr: "À l'affirmatif, 'a lot of' sonne plus naturel que 'many'." },
        ],
      },
      {
        title: '3. A few / Few vs A little / Little — sens positif ou négatif',
        rule: "'A few' / 'a little' = POSITIF (quelques / un peu). 'Few' / 'little' SANS 'a' = NÉGATIF (peu / pas assez). 'Few' avec dénombrable, 'little' avec indénombrable.",
        examples: [
          { en: 'I have a few friends here. Want to meet them?', fr: 'Sens positif → quelques.' },
          { en: 'Few people know my real name.', fr: 'Sens négatif → peu (de personnes).' },
          { en: 'We have a little time before the train.', fr: 'Sens positif → un peu.' },
          { en: 'I have little patience for liars.', fr: 'Sens négatif → pas assez de patience.' },
        ],
        warning: "Erreur fréquente FR : confondre 'few' et 'a few'. Le 'a' change tout le sens.",
      },
      {
        title: '4. Tous les autres : a lot of, plenty of, several, enough...',
        rule: "'A lot of' / 'lots of' fonctionne PARTOUT (dénombrable et indénombrable). 'Plenty of' = beaucoup (positif). 'Several' = plusieurs (dénombrable). 'Enough' après l'adjectif/avant le nom.",
        examples: [
          { en: 'I have plenty of time.', fr: 'Indénombrable.' },
          { en: 'She has several books on the topic.', fr: 'Dénombrable.' },
          { en: 'Is this enough water?', fr: 'Avant le nom.' },
          { en: "It's hot enough.", fr: "Après l'adjectif." },
        ],
      },
    ],
  },
  comparatives: {
    intro:
      "Comparer en anglais suit une règle simple : adjectif court → -er / -est, adjectif long → more / the most. Sauf irréguliers. Une fois la règle intégrée, plus jamais de doute.",
    sections: [
      {
        title: '1. Comparatif — court vs long',
        rule: "1 syllabe → adj + ER + than. 3+ syllabes → MORE + adj + than. 2 syllabes : variable (cas par cas, mais souvent -er si ça finit par -y).",
        examples: [
          { en: 'She is taller than me. (1 syl)', fr: 'tall → taller.' },
          { en: 'This is more interesting than that. (4 syl)', fr: 'interesting → more interesting.' },
          { en: 'Today is happier than yesterday. (2 syl, -y → -ier)', fr: 'happy → happier (-y devient -i).' },
        ],
        warning: "Ne jamais combiner les deux : 'more taller' ❌. C'est SOIT -er SOIT more, jamais les deux.",
      },
      {
        title: '2. Superlatif — court vs long',
        rule: "1 syllabe → THE + adj + EST. 3+ syllabes → THE MOST + adj. Toujours avec 'the'.",
        examples: [
          { en: 'She is the tallest in her class.', fr: 'the + adj-est.' },
          { en: 'This is the most interesting book.', fr: 'the most + adj.' },
          { en: 'He is the happiest man alive.', fr: 'happy → happiest.' },
        ],
      },
      {
        title: '3. Irréguliers — à mémoriser',
        rule: 'Quatre irréguliers majeurs : good / bad / far / many-much. À apprendre par cœur, ils reviennent tout le temps.',
        examples: [
          { en: 'good → better → the best', fr: 'Pas \"gooder\" ni \"the goodest\".' },
          { en: 'bad → worse → the worst', fr: 'Pas \"badder\" ni \"the baddest\".' },
          { en: 'far → farther/further → the farthest/furthest', fr: "'Farther' = distance physique, 'further' = abstrait/figuratif." },
          { en: 'many/much → more → the most', fr: '\"more\" fonctionne pour tout.' },
        ],
      },
      {
        title: '4. Less, not as... as, the more... the more',
        rule: "Pour l'infériorité : 'less + adj'. Pour l'égalité : 'as + adj + as'. Pour la proportion : 'the more X, the more Y'.",
        examples: [
          { en: 'This is less expensive than that.', fr: 'Infériorité = less.' },
          { en: 'She is as tall as her brother.', fr: 'Égalité = as ... as.' },
          { en: "I'm not as fast as you.", fr: 'Négation = pas aussi.' },
          { en: 'The more you practice, the better you get.', fr: 'Proportion = the more ... the more.' },
        ],
      },
    ],
  },
  passive: {
    intro:
      "La passive sert quand : (1) on ne sait pas qui fait l'action, (2) on s'en fiche, (3) on veut mettre l'ACTION ou l'OBJET en avant. La presse, le business, le scientifique = passive partout. Apprends-la et tu sonneras +10 ans plus expérimenté.",
    sections: [
      {
        title: '1. La formule magique : be + past participle (V3)',
        rule: "Passive = SUJET (qui SUBIT) + 'be' au bon temps + V3. Le 'be' s'accorde au sujet et au temps voulu.",
        examples: [
          { en: 'Active: Picasso painted Guernica.', fr: 'Picasso est le sujet actif.' },
          { en: 'Passive: Guernica was painted by Picasso.', fr: "Guernica est mis en avant ; 'by Picasso' = optionnel." },
          { en: 'The cake is made by my mom.', fr: 'Présent passif : is + made.' },
        ],
      },
      {
        title: '2. Passive à tous les temps',
        rule: "La structure 'be + V3' s'applique à tous les temps. Seul le 'be' change : am/is/are, was/were, has been, had been, will be, being.",
        examples: [
          { en: 'Present: The room is cleaned every day.', fr: 'is + V3.' },
          { en: 'Past: The room was cleaned yesterday.', fr: 'was + V3.' },
          { en: 'Present perfect: The room has been cleaned.', fr: 'has been + V3.' },
          { en: 'Future: The room will be cleaned tomorrow.', fr: 'will be + V3.' },
          { en: 'Continuous: The room is being cleaned right now.', fr: 'is being + V3.' },
        ],
      },
      {
        title: '3. Avec modaux : modal + BE + V3',
        rule: "Pour les modaux passifs, structure FIXE : modal + BE + V3. Jamais 'must + V3' tout court.",
        examples: [
          { en: 'The report must be finished by Friday.', fr: 'must + be + finished.' },
          { en: 'This rule cannot be broken.', fr: 'cannot + be + broken.' },
          { en: 'The form should be signed at the bottom.', fr: 'should + be + signed.' },
        ],
        warning: "Erreur classique : 'must finished' ou 'must been finished' — TOUJOURS 'must BE + V3'.",
      },
      {
        title: '4. By + agent (optionnel)',
        rule: "'By + agent' précise QUI fait l'action. On l'omet si l'agent est inconnu, évident ou peu pertinent.",
        examples: [
          { en: 'The bridge was built in 1932.', fr: 'On se fiche de qui — pas de by.' },
          { en: 'The bridge was built by Roman engineers.', fr: 'Si pertinent → by + agent.' },
          { en: 'My car was stolen last night!', fr: "Agent inconnu (les voleurs) — on n'ajoute pas by." },
        ],
      },
      {
        title: '5. Get passive (informel)',
        rule: "À l'oral, on remplace souvent 'be' par 'get' : 'He got fired' = 'He was fired'. Sens plus dynamique / négatif.",
        examples: [
          { en: 'He got fired last week.', fr: "Plus naturel à l'oral que \"was fired\"." },
          { en: 'I got hit by a car.', fr: 'Implique souvent une mauvaise nouvelle.' },
          { en: 'They got married in Hawaii.', fr: 'Aussi pour des événements (positifs ou neutres).' },
        ],
      },
    ],
  },
  reported: {
    intro:
      "Le discours rapporté = rapporter ce que quelqu'un a dit (ou demandé) au passé. C'est ICI que les Français se cassent les dents : tous les temps reculent d'un cran, les pronoms changent, les marqueurs de temps aussi. Mais c'est ESSENTIEL au B1 : c'est ce que tu fais 50 fois par jour ('he said that...').",
    sections: [
      {
        title: "1. La règle d'or : RECULE TOUT D'UN TEMPS",
        rule: "Quand tu rapportes au passé ('he said'), TOUS les temps de la phrase originale reculent d'un cran : present → past, past → past perfect, present perfect → past perfect, will → would, can → could, may → might, must → had to.",
        examples: [
          { en: '"I am tired" → He said he was tired.', fr: 'present → past.' },
          { en: '"I saw her" → He said he had seen her.', fr: 'past simple → past perfect.' },
          { en: '"I will help" → He said he would help.', fr: 'will → would.' },
          { en: '"I can swim" → He said he could swim.', fr: 'can → could.' },
        ],
        warning: "Modaux qui NE changent PAS : would, could, should, might, ought to (déjà au passé). Et 'should' surtout.",
      },
      {
        title: '2. Pronoms et possessifs changent aussi',
        rule: "Les pronoms s'ajustent à la nouvelle perspective. 'I' devient 'he/she'. 'You' (interlocuteur) devient 'me' ou un autre pronom selon contexte. 'My' devient 'his/her'.",
        examples: [
          { en: '"I love you" → He told her he loved her.', fr: '"I"→he, "you"→her.' },
          { en: '"My car is broken" → She said her car was broken.', fr: '"my"→her.' },
          { en: '"We arrived" → They said they had arrived.', fr: '"we"→they.' },
        ],
      },
      {
        title: '3. Marqueurs de temps qui changent',
        rule: 'Les références temporelles changent aussi pour rester cohérentes avec le moment de rapport.',
        examples: [
          { en: 'now → then / at that moment', fr: '"I am working now" → He said he was working then.' },
          { en: 'today → that day', fr: '"I saw her today" → He said he had seen her that day.' },
          { en: 'tomorrow → the next day / the following day', fr: '"I\'ll call tomorrow" → She said she would call the next day.' },
          { en: 'yesterday → the day before / the previous day', fr: '"I went yesterday" → He said he had gone the day before.' },
          { en: 'last week → the previous week', fr: "Décale d'un cran." },
        ],
      },
      {
        title: '4. Questions rapportées : if/whether + ORDRE NORMAL',
        rule: "Une question rapportée n'est plus une question ! Pas d'inversion, pas de '?', pas de 'do/does/did'. Pour les Yes/No : 'if' ou 'whether'. Pour les autres : on garde 'where/when/who/what...'.",
        examples: [
          { en: '"Are you OK?" → He asked if I was OK.', fr: 'Yes/No → if + ordre normal.' },
          { en: '"Where do you live?" → She asked where I lived.', fr: "Pas de 'do', juste 'lived'." },
          { en: '"What time is it?" → He asked what time it was.', fr: "Pas d'inversion : 'it was', pas 'was it'." },
        ],
        warning: "Erreur fréquente : garder l'inversion. ❌ 'He asked where DO I live.' ✅ 'He asked where I LIVED.'",
      },
      {
        title: '5. Impératifs rapportés : told (someone) to + V',
        rule: "Pour rapporter un ordre/demande à l'impératif : 'told/asked (someone) TO + verbe' (positif) ou 'NOT TO + verbe' (négatif).",
        examples: [
          { en: '"Close the door!" → She told me to close the door.', fr: 'Ordre positif → to + verbe.' },
          { en: '"Don\'t be late!" → He told me not to be late.', fr: 'Ordre négatif → NOT to + verbe.' },
          { en: '"Please help me." → She asked me to help her.', fr: 'Demande polie → asked + to.' },
        ],
      },
    ],
  },
  relatives: {
    intro:
      "Les relatives permettent de combiner deux phrases en une seule. C'est ce qui te fait passer de 'I have a friend. He lives in NY.' à 'I have a friend WHO lives in NY.' En anglais B1, tu DOIS savoir manier who/which/that/whose/where/when sans hésiter.",
    sections: [
      {
        title: '1. Who / Which / That — la base',
        rule: "'Who' pour les PERSONNES. 'Which' pour les CHOSES. 'That' fonctionne pour les deux (informel, restrictif seulement).",
        examples: [
          { en: 'The man who called is my uncle.', fr: 'Personne → who.' },
          { en: 'The book which I bought is great.', fr: 'Chose → which.' },
          { en: 'The friend that helped me is here.', fr: "'That' = passe-partout (informel)." },
        ],
        warning: "Dans une relative NON-restrictive (entre virgules), 'that' est INTERDIT : 'My sister, who lives in NY, is...' ✅ Jamais 'that'.",
      },
      {
        title: '2. Whose — la possession (= dont le)',
        rule: "'Whose' indique la possession. Suivi directement du nom possédé, sans article.",
        examples: [
          { en: 'The woman whose husband works at Google.', fr: 'Dont le mari travaille.' },
          { en: 'The book whose cover is red is mine.', fr: 'Dont la couverture est rouge.' },
          { en: 'Anna, whose dog ran away, is sad.', fr: 'Possible aussi en non-restrictif.' },
        ],
      },
      {
        title: '3. Where / When / Why — lieu, temps, raison',
        rule: "'Where' = pour un LIEU. 'When' = pour un MOMENT. 'Why' = pour une RAISON.",
        examples: [
          { en: 'The hotel where we stayed was nice.', fr: 'Lieu → where.' },
          { en: 'The day when we met was sunny.', fr: 'Moment → when.' },
          { en: "I don't know the reason why she left.", fr: 'Raison → why.' },
        ],
        warning: "'Where' remplace 'in/at + which' : 'The city WHERE I live' = 'The city IN WHICH I live' (formel).",
      },
      {
        title: '4. Restrictive vs non-restrictive (la virgule change TOUT)',
        rule: 'Restrictive (SANS virgules) = info essentielle pour identifier. Non-restrictive (AVEC virgules) = info supplémentaire, accessoire.',
        examples: [
          { en: 'My brother who lives in NY is a chef.', fr: "J'ai PLUSIEURS frères ; celui de NY est chef." },
          { en: 'My brother, who lives in NY, is a chef.', fr: "J'ai UN seul frère ; au passage, il vit à NY." },
        ],
        warning: "En non-restrictif : pas de 'that', et pas d'omission du pronom relatif (interdit).",
      },
      {
        title: '5. Omission du pronom relatif',
        rule: "Quand le pronom relatif est OBJET (pas sujet) de la relative, on peut souvent l'OMETTRE — c'est même plus naturel à l'oral.",
        examples: [
          { en: 'The book (that) I bought is great.', fr: "'that' est objet → optionnel." },
          { en: 'The friend (who/that) I met is here.', fr: 'Omission OK.' },
          { en: 'The man who called is my uncle.', fr: "'who' est SUJET → on garde toujours." },
        ],
      },
    ],
  },
  tags: {
    intro:
      "Question tags = ces petits '..., isn't it?' / '..., don't you?' à la fin des phrases. C'est LA marque du locuteur anglais natif. Sans tags, tu sonnes scolaire. Avec, tu sonnes fluide. La règle est simple : on REPREND l'auxiliaire et on INVERSE la polarité.",
    sections: [
      {
        title: '1. La règle de base : reprendre + inverser',
        rule: "Phrase POSITIVE → tag NÉGATIF. Phrase NÉGATIVE → tag POSITIF. On reprend l'AUXILIAIRE de la phrase (be, do, have, will, can...).",
        examples: [
          { en: "You are French, aren't you?", fr: '+ → -. "are" → "aren\'t".' },
          { en: "She doesn't smoke, does she?", fr: '- → +. "doesn\'t" → "does".' },
          { en: "They went home, didn't they?", fr: 'Past simple + → "didn\'t".' },
        ],
      },
      {
        title: '2. Avec be, do, have, will, can, must...',
        rule: "On reprend l'auxiliaire EXACT. Si pas d'auxiliaire visible (verbe à l'affirmatif present/past), on utilise 'do/does/did'.",
        examples: [
          { en: "She is here, isn't she?", fr: "be → isn't." },
          { en: "He has called, hasn't he?", fr: "have → hasn't." },
          { en: "We can leave, can't we?", fr: "can → can't." },
          { en: "You like coffee, don't you?", fr: "Verbe simple → do/don't." },
        ],
      },
      {
        title: "3. Les exceptions : I am, Let's, impératifs",
        rule: "Cas spéciaux à mémoriser : 'I am' → tag \"aren't I\" (anomalie). 'Let's' → tag 'shall we'. Impératif → tag 'will you' / 'could you'.",
        examples: [
          { en: "I'm late, aren't I?", fr: "EXCEPTION historique : 'aren't I' (pas 'amn't I')." },
          { en: "Let's go, shall we?", fr: "Toujours \"shall we\" après \"Let's\"." },
          { en: 'Open the door, will you?', fr: 'Impératif → "will you" (ou "would you" plus poli).' },
        ],
      },
      {
        title: '4. Avec there is, nobody, never...',
        rule: "Avec 'there is/are' → on reprend 'there'. Avec des mots à sens NÉGATIF caché (nobody, never, hardly, no one...) → tag positif.",
        examples: [
          { en: "There's a problem, isn't there?", fr: "Avec \"there\" → \"isn't there\"." },
          { en: 'Nobody called, did they?', fr: '"Nobody" = sens négatif → tag positif. Pronom "they".' },
          { en: 'She never lies, does she?', fr: '"Never" = négatif → tag positif.' },
        ],
        warning: "Erreur fréquente : dire 'isn't it' partout. 'It' ne marche QUE si le sujet est 'it' ou un objet inanimé pris comme 'it'.",
      },
    ],
  },
  connectors: {
    intro:
      "Les connecteurs = la colle de tes phrases. Sans eux, tu juxtaposes ('I was tired. I worked.'). Avec eux, tu construis ('I was tired, however I kept working'). À l'écrit B1+, on attend de toi 5-10 connecteurs variés par paragraphe. C'est ce qui différencie un texte A2 d'un texte B1.",
    sections: [
      {
        title: '1. Contraste : but, however, although, despite',
        rule: "'But' = informel, mi-phrase. 'However' = formel, début de phrase + virgule. 'Although' / 'even though' + sujet+verbe. 'Despite' / 'in spite of' + nom ou -ing.",
        examples: [
          { en: 'It was raining, but we went out.', fr: '"but" en milieu de phrase.' },
          { en: 'It was raining. However, we went out.', fr: '"However" + virgule, plus formel.' },
          { en: 'Although it was raining, we went out.', fr: '"Although" + sujet+verbe.' },
          { en: 'Despite the rain, we went out.', fr: '"Despite" + NOM.' },
          { en: 'Despite being tired, she finished.', fr: '"Despite" + V-ING.' },
        ],
        warning: "Ne JAMAIS dire 'despite OF the rain' ❌. C'est 'despite the rain' OU 'in spite OF the rain'. Choisis ton camp.",
      },
      {
        title: '2. Cause / conséquence : because, since, so, therefore, as a result',
        rule: "'Because' / 'since' = cause. 'So' = conséquence informel. 'Therefore' / 'as a result' / 'consequently' = conséquence formelle.",
        examples: [
          { en: 'She left because she was tired.', fr: 'Cause directe.' },
          { en: "Since you're here, let's talk.", fr: '"Since" = puisque (cause + connaissance partagée).' },
          { en: 'I missed the bus, so I walked.', fr: 'Conséquence simple.' },
          { en: 'I missed the bus. Therefore, I walked.', fr: 'Plus formel.' },
        ],
      },
      {
        title: '3. Addition : also, moreover, in addition, furthermore',
        rule: "'Also' = mi-phrase, informel. 'Moreover' / 'furthermore' / 'in addition' = début de phrase, formel, pour ÉCRIT B1+.",
        examples: [
          { en: 'She is smart. She is also funny.', fr: 'Mi-phrase.' },
          { en: "The food is good. Moreover, it's cheap.", fr: 'Formel, écrit.' },
          { en: 'The team is talented. In addition, they work hard.', fr: 'En plus.' },
          { en: "It rains often here. Furthermore, it's cold.", fr: 'De plus.' },
        ],
      },
      {
        title: '4. Séquence et conclusion : first, then, finally, overall',
        rule: "Pour structurer un récit / une procédure : 'First', 'Then' / 'Next', 'After that', 'Finally'. Pour conclure : 'Overall', 'In conclusion', 'All in all'.",
        examples: [
          { en: 'First, preheat the oven. Then, mix the ingredients.', fr: 'Recette typique.' },
          { en: 'Finally, bake for 30 minutes.', fr: 'Dernière étape.' },
          { en: 'Overall, the project was a success.', fr: 'Conclusion synthétique.' },
        ],
      },
      {
        title: "5. Top combo à utiliser dès demain à l'écrit",
        rule: 'Mémorise ces 6 combos puissants — ils te boostent à B1+ direct.',
        examples: [
          { en: 'On the one hand... on the other hand...', fr: "D'un côté... de l'autre côté." },
          { en: 'Not only... but also...', fr: 'Non seulement... mais aussi.' },
          { en: 'For example / for instance', fr: 'Par exemple. Le 2e plus formel.' },
          { en: 'In other words / that is to say', fr: "Autrement dit / c'est-à-dire." },
          { en: "As far as I'm concerned, ...", fr: 'En ce qui me concerne (donne ton avis).' },
          { en: 'To sum up, ...', fr: 'Pour résumer.' },
        ],
      },
    ],
  },
  phrasalVerbs: {
    intro:
      "Les phrasal verbs = verbe + particule (preposition/adverb) qui PREND UN NOUVEAU SENS. 'Pick up' ≠ 'pick'. C'est l'anglais authentique : un natif dit 'I picked up the kids' plus souvent que 'I fetched the children'. Tu en as déjà vu certains — voici la méthode pour les apprivoiser tous.",
    sections: [
      {
        title: '1. Comment ça fonctionne',
        rule: "Un phrasal verb = verbe + 1 ou 2 particules. La particule peut COMPLÈTEMENT changer le sens. Le sens est souvent IDIOMATIQUE — pas littéral.",
        examples: [
          { en: 'look = regarder', fr: 'Verbe seul.' },
          { en: 'look up = chercher (dans un dictionnaire)', fr: 'Sens nouveau, pas littéral.' },
          { en: 'look up to = admirer', fr: 'Avec 2 particules — sens encore différent.' },
          { en: "look after = s'occuper de", fr: 'Encore un sens différent.' },
          { en: 'look forward to = attendre avec impatience', fr: 'Idiomatique.' },
        ],
      },
      {
        title: '2. Séparables vs inséparables — la règle clé',
        rule: "Séparable : l'objet peut se mettre AU MILIEU. Avec un PRONOM (it, them, him...), il DOIT être au milieu. Inséparable : on ne sépare jamais.",
        examples: [
          { en: 'Pick up the kids. / Pick the kids up.', fr: 'Séparable : les deux marchent.' },
          { en: 'Pick them up.', fr: 'Avec un pronom → OBLIGATOIRE au milieu.' },
          { en: 'Look into the issue.', fr: 'Inséparable : pas "look the issue into".' },
          { en: 'I run into him every day.', fr: '"Run into" inséparable même avec un pronom.' },
        ],
        warning: 'Stratégie : apprendre la séparabilité avec le sens. Le seed `phrasal-verbs.json` te dit lequel est lequel.',
      },
      {
        title: '3. Top 15 à connaître absolument',
        rule: 'Si tu apprends seulement 15 phrasal verbs, ce sont ceux-là. 80% des conversations courantes y passent.',
        examples: [
          { en: 'pick up = aller chercher / ramasser', fr: 'Pick the kids up at 5.' },
          { en: 'give up = abandonner', fr: "Don't give up!" },
          { en: 'look forward to = avoir hâte', fr: 'I look forward to seeing you.' },
          { en: 'run out of = être à court de', fr: 'We ran out of milk.' },
          { en: "get along (with) = bien s'entendre", fr: 'I get along with my boss.' },
          { en: 'figure out = comprendre / résoudre', fr: "I can't figure it out." },
          { en: 'set up = organiser / installer', fr: "Let's set up a meeting." },
          { en: 'come up with = trouver (une idée)', fr: 'She came up with a plan.' },
          { en: 'deal with = gérer', fr: "I'll deal with it." },
          { en: 'count on = compter sur', fr: 'You can count on me.' },
          { en: 'end up = finir par', fr: 'We ended up staying home.' },
          { en: 'turn down = refuser / baisser', fr: 'He turned down the offer.' },
          { en: 'take over = reprendre / prendre le contrôle', fr: 'She took over the project.' },
          { en: 'point out = faire remarquer', fr: 'He pointed out a mistake.' },
          { en: 'show up = se pointer', fr: "He didn't show up." },
        ],
      },
      {
        title: "4. Stratégie d'apprentissage : par thème",
        rule: "N'essaie PAS d'apprendre 200 phrasal verbs hors contexte. Regroupe-les par THÈME, par situation. C'est ce que fait ton seed `phrasal-verbs.json`.",
        examples: [
          { en: 'TÉLÉPHONE : call back, hang up, get through, pick up, put through', fr: 'Tout le vocabulaire du téléphone.' },
          { en: 'BOULOT : set up, take over, follow up, deal with, sign up, wrap up', fr: 'Le vocabulaire du bureau.' },
          { en: 'RELATIONS : get along, hit it off, break up, make up, ask out', fr: 'Le vocabulaire amoureux/social.' },
          { en: 'VOYAGE : check in, check out, take off, get on, get off, look around', fr: 'Le vocabulaire du voyage.' },
        ],
      },
    ],
  },
  collocations: {
    intro:
      "Une collocation = un assemblage de mots qui SONNE NATUREL en anglais mais qui n'a aucune logique apparente. Le pire piège : 'make a decision' (pas 'take') / 'do a favor' (pas 'make'). Apprends ces couples par cœur — c'est ce qui te fera sonner natif à 90%.",
    sections: [
      {
        title: '1. Make vs Do — la grande question',
        rule: 'MAKE = créer, fabriquer, produire (un résultat). DO = activité, tâche, action générale. Quand tu hésites, retiens : MAKE = résultat / DO = activité.',
        examples: [
          { en: 'make a decision / a choice / an offer', fr: 'On PRODUIT une décision.' },
          { en: 'make a mistake / progress / sense', fr: 'Résultats abstraits.' },
          { en: 'make noise / a phone call / dinner', fr: 'On PRODUIT du bruit, un appel.' },
          { en: 'do homework / housework / the dishes', fr: 'ACTIVITÉS, tâches.' },
          { en: 'do business / research / a favor / sport', fr: 'Activités générales.' },
          { en: 'do your best / nothing / everything', fr: 'Avec mots indéfinis.' },
        ],
        warning: "Pièges FR : 'do a decision' ❌ (c'est 'make'). 'make my homework' ❌ (c'est 'do').",
      },
      {
        title: '2. Take vs Have — actions ponctuelles vs expériences',
        rule: 'TAKE (US surtout) = action courte ponctuelle ou déplacement. HAVE = avoir une expérience, posséder, ressentir.',
        examples: [
          { en: 'take a shower / a bath / a nap', fr: 'Action ponctuelle.' },
          { en: 'take a break / a walk / a photo / a chance', fr: 'Action que tu prends.' },
          { en: 'take a bus / a taxi / a flight', fr: 'Moyen de transport = take.' },
          { en: 'have lunch / dinner / breakfast', fr: 'Avoir un repas.' },
          { en: 'have fun / a good time / a headache', fr: 'Expérience / ressenti.' },
          { en: 'have a baby / a meeting / a question', fr: 'Possession ou événement.' },
        ],
        warning: "UK vs US : 'have a shower' (UK) vs 'take a shower' (US). Tu apprends l'US — privilégie 'take' pour les actions ponctuelles.",
      },
      {
        title: '3. Get — le verbe couteau suisse',
        rule: "GET a 5+ sens : (1) recevoir / obtenir, (2) devenir, (3) arriver, (4) comprendre, (5) chercher quelqu'un. C'est le verbe préféré des natifs à l'oral.",
        examples: [
          { en: 'I got a present / a job / an email.', fr: '(1) recevoir.' },
          { en: 'I got tired / cold / sick / angry.', fr: '(2) devenir.' },
          { en: 'I got home at 7 / to the office on time.', fr: '(3) arriver.' },
          { en: "I get it. / I don't get the joke.", fr: '(4) comprendre.' },
          { en: "I'll get the kids from school.", fr: '(5) aller chercher.' },
          { en: 'He got married / divorced / promoted.', fr: "Get + V3 (sens passif/changement d'état)." },
        ],
      },
      {
        title: '4. Top 20 collocations à mémoriser',
        rule: 'Apprends ces 20 par cœur. 80% des erreurs FR portent sur ces couples.',
        examples: [
          { en: 'make a decision (pas "take")', fr: 'PRENDRE une décision.' },
          { en: 'do a favor (pas "make")', fr: 'RENDRE un service.' },
          { en: 'take a break / a photo / a nap', fr: 'PRENDRE une pause/photo/sieste.' },
          { en: 'have a shower / lunch / fun', fr: 'AVOIR (US privilégie take pour shower).' },
          { en: 'make progress / an effort / a mistake', fr: 'FAIRE des progrès/effort/erreur.' },
          { en: 'do homework / business / sports', fr: 'FAIRE les devoirs/affaires/sport.' },
          { en: 'pay attention (pas "give")', fr: 'PRÊTER attention.' },
          { en: 'tell the truth (pas "say")', fr: 'DIRE la vérité.' },
          { en: 'catch a cold / the flu / a bus', fr: 'ATTRAPER un rhume/grippe.' },
          { en: 'get a haircut / a tattoo / a chance', fr: 'AVOIR/SE FAIRE une coupe.' },
          { en: 'make money / a living', fr: 'GAGNER sa vie.' },
          { en: 'do the dishes / laundry / shopping', fr: 'FAIRE la vaisselle/lessive.' },
          { en: 'take a chance / take a risk', fr: 'PRENDRE un risque.' },
          { en: 'have a baby / a party', fr: 'AVOIR un bébé/une fête.' },
          { en: 'make sense / make sure / make a noise', fr: "AVOIR du sens / s'assurer." },
        ],
      },
    ],
  },
  falseFriends: {
    intro:
      "Les faux amis sont les mots anglais qui RESSEMBLENT à un mot français mais qui veulent dire AUTRE CHOSE. C'est piège #2 des francophones (après les articles). Sans le savoir, tu peux dire l'opposé de ce que tu veux : 'sensible' en anglais = 'sensible' (FR : sensé). Apprends-les vite — ce sont les classiques qui font sourire les natifs.",
    sections: [
      {
        title: '1. Faux amis adverbes — les pires',
        rule: "Les adverbes piègent le plus parce qu'on les utilise tous les jours et qu'ils sonnent FR.",
        examples: [
          { en: 'actually = en fait', fr: '≠ actuellement (= currently)' },
          { en: 'currently = actuellement', fr: '≠ couramment (= fluently)' },
          { en: 'eventually = finalement, à la fin', fr: '≠ éventuellement (= possibly)' },
          { en: 'finally = enfin (impatience)', fr: '≠ finalement (= eventually pour long terme)' },
          { en: 'definitely = absolument, sans aucun doute', fr: '≠ définitivement (= permanently)' },
        ],
        warning: "Si tu dis 'actually' pour 'actuellement', un natif comprendra 'en fait' — décalage de sens TOTAL.",
      },
      {
        title: '2. Faux amis verbes',
        rule: 'Ces verbes piègent énormément. Mémorise les vrais sens.',
        examples: [
          { en: 'attend = assister à', fr: '≠ attendre (= wait for)' },
          { en: 'assist = aider', fr: '≠ assister à (= attend)' },
          { en: 'support = soutenir', fr: '≠ supporter (au sens "endurer" = put up with / tolerate)' },
          { en: 'pretend = faire semblant', fr: '≠ prétendre (= claim)' },
          { en: 'resume = reprendre, continuer', fr: '≠ résumer (= summarize)' },
          { en: 'demand = exiger', fr: '≠ demander (= ask)' },
          { en: 'achieve = accomplir, réaliser', fr: '≠ achever au sens "terminer" (= complete / finish)' },
        ],
      },
      {
        title: '3. Faux amis noms',
        rule: "Très fréquents et parfois CRITIQUES (peuvent changer le sens d'une phrase entière).",
        examples: [
          { en: 'library = bibliothèque', fr: '≠ librairie (= bookstore)' },
          { en: 'location = emplacement, lieu', fr: '≠ location (= rental)' },
          { en: 'journey = voyage', fr: '≠ journée (= day)' },
          { en: 'travel = action de voyager', fr: '≠ travail (= work / job)' },
          { en: 'chance = hasard, opportunité', fr: '≠ chance (au sens FR "bonne fortune" = luck)' },
          { en: 'occasion = événement particulier', fr: '≠ occasion (au sens "opportunité" = opportunity)' },
          { en: 'figure = chiffre / silhouette', fr: '≠ figure (au sens visage = face)' },
          { en: 'agenda = programme/ordre du jour', fr: '≠ agenda (au sens carnet = planner / diary)' },
        ],
      },
      {
        title: '4. Faux amis adjectifs — attention aux INVERSES',
        rule: "Certains adjectifs ont des sens carrément INVERSES en EN et FR. Mémorise-les ou tu vas dire l'opposé.",
        examples: [
          { en: 'sensible = sensé, raisonnable', fr: '≠ sensible (= sensitive)' },
          { en: 'sensitive = sensible, délicat', fr: '≠ sensé (= sensible)' },
          { en: 'sympathetic = compatissant', fr: '≠ sympathique (= nice / friendly)' },
          { en: 'large = vaste, grand', fr: '≠ large (au sens "wide" = wide)' },
          { en: 'gentle = doux', fr: '≠ gentil (= kind / nice)' },
          { en: 'rude = grossier, impoli', fr: '≠ rude (au sens "difficile" = harsh / tough)' },
          { en: 'novel (adj) = nouveau, original', fr: '≠ novel (n) = roman (qui veut bien dire "roman")' },
        ],
        warning: "'Sensible' / 'sensitive' = inversion parfaite. À mémoriser absolument. Le couple #1 à savoir pour parler anglais correctement.",
      },
    ],
  },
};

export const LESSONS = LESSONS_RAW as Record<CategoryId, Lesson>;
