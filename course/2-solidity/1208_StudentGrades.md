• Ecrireunsmartcontractquigèreunsystèmedenotationd'uneclassed'étudiants avec les fonctions suivantes :
• addTeacher(address_teacherAddress)
• addGrades(stringmemory_name, uint_gradeBiology, uint_gradeMath, uint
_gradeFr)
• getGradeAverageStudent(uint_idStudent)
• getGradeAverageOfClassInASubject(uint_subject)
• getAverageGradeOfClass()
• Unélèveestdéfiniparunestructurededonnées: struct Student {
string name
uint gradeBiology; uint gradeMath; uint gradeFr; 
}
• Lepropriétaireducontratintelligentpeutajouterdesprofesseurs
• Lesprofesseursadéquats(rentrésen"dur")peuventrajouterdesnotes. Chaque élève est stocké de manière pertinente. On doit pouvoir récupérer:
* la moyenne générale d’un élève
* la moyenne de la classe sur une matière
* la moyenne générale de la classe au global
