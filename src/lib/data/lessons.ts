import type { Lesson, CategoryId } from '@/lib/types';

export const LESSONS: Record<CategoryId, Lesson> = {
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
};
