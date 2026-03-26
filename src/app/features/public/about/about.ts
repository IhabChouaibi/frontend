import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: false,
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  readonly domains = [
    'e-Governement',
    'Dematerialisation et digitalisation des procedures',
    'Plateforme Workflow',
    'Archivage electronique / GED',
    'Plateformes d echanges de donnees',
    'e-Finance',
    'Marche financier',
    'Bourse',
    'Intermediaires en bourse',
    'Banques',
    'Societes de gestion',
    'e-Business & ERP Metiers',
    'Consulting',
    'Ingenierie des solutions',
    'Etudes et conception de systemes'
  ];

  readonly values = [
    'Relation de confiance avec les clients',
    'Prestations innovantes et performantes',
    'Amelioration continue',
    'Ethique des affaires',
    'Haute valeur ajoutee'
  ];

  readonly expertiseHighlights = [
    'Referentiel PMI pour l initiation, la planification, l execution, la maitrise et la cloture des projets',
    'Approches Agile pour accelerer la realisation',
    'Maitrise totale des processus metier',
    'Reingenierie et connaissances specialisees'
  ];
}
