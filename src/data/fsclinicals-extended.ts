// export const fsclinicalsForm = {
//     title: "Four Square Clinicals Forms",
//     pages: [
//         {
//             name: "patient_information",
//             title: "Patient Information",
//             elements: [
//                 {
//                     type: "text",
//                     name: "last_name",
//                     title: "Last Name",
//                 },
//                 {
//                     type: "text",
//                     name: "first_name",
//                     title: "First Name",
//                 },
//                 {
//                     type: "text",
//                     name: "middle_initial",
//                     title: "MI",
//                 },
//                 {
//                     type: "text",
//                     name: "dob",
//                     title: "DOB",
//                 },
//                 {
//                     type: "text",
//                     name: "address",
//                     title: "Address",
//                 },
//                 {
//                     type: "text",
//                     name: "city",
//                     title: "City",
//                 },
//                 {
//                     type: "text",
//                     name: "state",
//                     title: "State",
//                 },
//                 {
//                     type: "text",
//                     name: "zip",
//                     title: "Zip",
//                 },
//                 {
//                     type: "text",
//                     name: "telephone",
//                     title: "Telephone",
//                 },
//                 {
//                     type: "text",
//                     name: "email",
//                     title: "Email",
//                 },
//             ],
//         },
//         {
//             name: "authorization_release",
//             title: "Authorization for Use or Disclosure of Behavioral Health Record",
//             elements: [
//                 {
//                     type: "text",
//                     name: "release_from",
//                     title: "Release From: Person/Entity",
//                 },
//                 {
//                     type: "text",
//                     name: "release_from_address",
//                     title: "Address",
//                 },
//                 {
//                     type: "text",
//                     name: "release_from_city",
//                     title: "City/State/Zip",
//                 },
//                 {
//                     type: "text",
//                     name: "release_from_phone",
//                     title: "Phone",
//                 },
//                 {
//                     type: "text",
//                     name: "release_from_fax",
//                     title: "Fax",
//                 },
//                 {
//                     type: "text",
//                     name: "release_to",
//                     title: "Release To: Person/Entity",
//                 },
//                 {
//                     type: "text",
//                     name: "release_to_address",
//                     title: "Address",
//                 },
//                 {
//                     type: "text",
//                     name: "release_to_city",
//                     title: "City/State/Zip",
//                 },
//                 {
//                     type: "text",
//                     name: "release_to_phone",
//                     title: "Phone",
//                 },
//                 {
//                     type: "text",
//                     name: "release_to_fax",
//                     title: "Fax",
//                 },
//                 {
//                     type: "checkbox",
//                     name: "release_purpose",
//                     title: "Purpose",
//                     choices: [
//                         "Continuing Treatment",
//                         "Legal",
//                         "Insurance",
//                         "Personal Use",
//                         "Other",
//                     ],
//                 },
//                 {
//                     type: "panel",
//                     name: "information_to_release",
//                     title: "Information to Release",
//                     elements: [
//                         {
//                             type: "text",
//                             name: "date_range_from",
//                             title: "Date Range of Records Requested: From",
//                         },
//                         {
//                             type: "text",
//                             name: "date_range_to",
//                             title: "To",
//                         },
//                         {
//                             type: "checkbox",
//                             name: "information_requested",
//                             title: "Please initial next to each type of information requested",
//                             choices: [
//                                 "Summary Letter",
//                                 "Attendance Record",
//                                 "Medications List",
//                                 "Contact Log",
//                                 "Initial Evaluation",
//                                 "Treatment Plan",
//                                 "Progress Notes",
//                                 "Psychotherapy Notes",
//                                 "Self-Care Management Plan",
//                                 "Results of Diagnostic Testing",
//                                 "Other",
//                             ],
//                         },
//                         {
//                             type: "radiogroup",
//                             name: "family_counseling_release",
//                             title: "Joint/Family Counseling: Information disclosed may include notes/records from joint/family counseling sessions, if any. Initial one of the following statements:",
//                             choices: [
//                                 "I do authorize release of information from joint/family counseling sessions",
//                                 "I do not authorize release of information from joint/family counseling sessions",
//                             ],
//                         },
//                         {
//                             type: "text",
//                             name: "sensitive_information_acknowledgement",
//                             title: "Sensitive Information: My initials demonstrate my acknowledgement and authorization to release or disclose this type of information:",
//                         },
//                         {
//                             type: "radiogroup",
//                             name: "delivery_instructions",
//                             title: "Delivery Instructions",
//                             choices: [
//                                 "Mail",
//                                 "Fax records directly to person/entity specified above",
//                                 "Call patient when records are ready for pick up",
//                                 "Patient/Representative authorizes to pick up the copies",
//                                 "Other instructions",
//                             ],
//                         },
//                         {
//                             type: "text",
//                             name: "expiration",
//                             title: "Expiration: Without my written revocation, this authorization will automatically expire upon satisfaction of the need for disclosure, or one year from the date signed, unless otherwise specified:",
//                         },
//                     ],
//                 },
//                 {
//                     type: "html",
//                     name: "notice_of_rights",
//                     title: "Notice of Rights",
//                     isCollapsed: true,
//                     html: `
//                         <h4>Notice of Rights:</h4>
//                         <ul>
//                             <li>If I refuse to sign this authorization, my refusal will not affect my ability to obtain treatment.</li>
//                             <li>I may inspect or obtain a copy of the health information requested in this authorization.</li>
//                             <li>I may revoke this authorization at any time in writing, signed by me or on my behalf, and delivered to Four Square Clinicals, Medical Records, 100 N Arlington Ave, Suite 340A, Reno, NV 89501.</li>
//                             <li>If I revoke this authorization, the revocation will not have any effect on any actions taken prior to Four Square Clinicals’ receipt of the revocation.</li>
//                             <li>I have a right to receive a copy of this authorization.</li>
//                             <li>Information disclosed pursuant to this authorization could be re-disclosed by the recipient and may no longer be protected by the federal privacy rule (HIPAA). However, Nevada law prohibits the person receiving my health information from making further disclosure of it unless another authorization for such disclosure is obtained from me or unless such disclosure is specifically required or permitted by law.</li>
//                         </ul>
//                     `,
//                 },
//                 {
//                     type: "text",
//                     name: "patient_signature",
//                     title: "Signature of Patient or Legal Representative",
//                 },
//                 {
//                     type: "text",
//                     name: "patient_signature_date",
//                     title: "Date",
//                 },
//                 {
//                     type: "text",
//                     name: "relationship",
//                     title: "Relationship (if Legal Representative)",
//                 },
//                 {
//                     type: "text",
//                     name: "provider_signature",
//                     title: "Signature of Provider",
//                 },
//                 {
//                     type: "text",
//                     name: "provider_signature_date",
//                     title: "Date",
//                 },
//             ],
//         },
//         {
//             name: "nichq_vanderbilt_assessment_scale",
//             title: "NICHQ Vanderbilt Assessment Scale",
//             elements: [
//                 {
//                     type: "text",
//                     name: "date",
//                     title: "Today's Date",
//                 },
//                 {
//                     type: "text",
//                     name: "child_name",
//                     title: "Child's Name",
//                 },
//                 {
//                     type: "text",
//                     name: "child_dob",
//                     title: "Date of Birth",
//                 },
//                 {
//                     type: "text",
//                     name: "informant_name",
//                     title: "Informant's Name (Parent/Teacher)",
//                 },
//                 {
//                     type: "text",
//                     name: "informant_phone",
//                     title: "Informant's Phone Number",
//                 },
//                 {
//                     type: "radiogroup",
//                     name: "evaluation_basis",
//                     title: "Is this evaluation based on a time when the child was on medication?",
//                     choices: [
//                         "Was on medication",
//                         "Was not on medication",
//                         "Not sure",
//                     ],
//                 },
//                 {
//                     type: "matrix",
//                     name: "symptoms",
//                     title: "Symptoms",
//                     columns: [
//                         { value: "never", text: "Never" },
//                         { value: "occasionally", text: "Occasionally" },
//                         { value: "often", text: "Often" },
//                         { value: "very_often", text: "Very Often" },
//                     ],
//                     rows: [
//                         {
//                             value: "attention_details",
//                             text: "Fails to give attention to details or makes careless mistakes in schoolwork",
//                         },
//                         {
//                             value: "difficulty_attention",
//                             text: "Has difficulty sustaining attention to tasks or activities",
//                         },
//                         {
//                             value: "does_not_listen",
//                             text: "Does not seem to listen when spoken to directly",
//                         },
//                         {
//                             value: "follow_directions",
//                             text: "Does not follow through on instructions and fails to finish schoolwork (not due to oppositional behavior or failure to understand)",
//                         },
//                         {
//                             value: "organizing_tasks",
//                             text: "Has difficulty organizing tasks and activities",
//                         },
//                         {
//                             value: "avoids_tasks",
//                             text: "Avoids, dislikes, or is reluctant to engage in tasks that require sustained mental effort",
//                         },
//                         {
//                             value: "loses_things",
//                             text: "Loses things necessary for tasks or activities (school assignments, pencils, or books)",
//                         },
//                         {
//                             value: "easily_distracted",
//                             text: "Is easily distracted by extraneous stimuli",
//                         },
//                         {
//                             value: "forgetful_daily",
//                             text: "Is forgetful in daily activities",
//                         },
//                         {
//                             value: "fidgets",
//                             text: "Fidgets with hands or feet or squirms in seat",
//                         },
//                         {
//                             value: "leaves_seat",
//                             text: "Leaves seat in classroom or in other situations in which remaining seated is expected",
//                         },
//                         {
//                             value: "runs_climbs",
//                             text: "Runs about or climbs excessively in situations in which remaining seated is expected",
//                         },
//                         {
//                             value: "difficulty_playing",
//                             text: "Has difficulty playing or engaging in leisure activities quietly",
//                         },
//                         {
//                             value: "on_the_go",
//                             text: "Is 'on the go' or often acts as if 'driven by a motor'",
//                         },
//                         { value: "talks_too_much", text: "Talks excessively" },
//                         {
//                             value: "blurts_out",
//                             text: "Blurts out answers before questions have been completed",
//                         },
//                         {
//                             value: "difficulty_waiting",
//                             text: "Has difficulty waiting in line",
//                         },
//                         {
//                             value: "interrupts_intrudes",
//                             text: "Interrupts or intrudes on others (eg, butts into conversations/games)",
//                         },
//                         { value: "loses_temper", text: "Loses temper" },
//                         {
//                             value: "defies_refuses",
//                             text: "Actively defies or refuses to comply with adult’s requests or rules",
//                         },
//                         {
//                             value: "angry_resentful",
//                             text: "Is angry or resentful",
//                         },
//                         {
//                             value: "spiteful_vindictive",
//                             text: "Is spiteful and vindictive",
//                         },
//                         {
//                             value: "bullies_threatens",
//                             text: "Bullies, threatens, or intimidates others",
//                         },
//                         {
//                             value: "starts_fights",
//                             text: "Initiates physical fights",
//                         },
//                         {
//                             value: "lies_to_get_out",
//                             text: "Lies to obtain goods for favors or to avoid obligations (eg, 'cons' others)",
//                         },
//                         {
//                             value: "physically_cruel_people",
//                             text: "Is physically cruel to people",
//                         },
//                         {
//                             value: "stolen_things_value",
//                             text: "Has stolen items of nontrivial value",
//                         },
//                         {
//                             value: "deliberately_destroys_property",
//                             text: "Deliberately destroys others’ property",
//                         },
//                         {
//                             value: "fearful_anxious",
//                             text: "Is fearful, anxious, or worried",
//                         },
//                         {
//                             value: "self_conscious",
//                             text: "Is self-conscious or easily embarrassed",
//                         },
//                         {
//                             value: "afraid_try_new_things",
//                             text: "Is afraid to try new things for fear of making mistakes",
//                         },
//                         {
//                             value: "feels_worthless_inferior",
//                             text: "Feels worthless or inferior",
//                         },
//                         {
//                             value: "blames_self",
//                             text: "Blames self for problems; feels guilty",
//                         },
//                         {
//                             value: "feels_lonely",
//                             text: "Feels lonely, unwanted, or unloved; complains that 'no one loves him or her'",
//                         },
//                         {
//                             value: "sad_unhappy",
//                             text: "Is sad, unhappy, or depressed",
//                         },
//                     ],
//                 },
//                 {
//                     type: "matrix",
//                     name: "performance",
//                     title: "Performance",
//                     columns: [
//                         { value: "excellent", text: "Excellent" },
//                         {
//                             value: "above_average",
//                             text: "Somewhat Above Average",
//                         },
//                         { value: "average", text: "Average" },
//                         { value: "problem", text: "Problem" },
//                         { value: "problematic", text: "Problematic" },
//                     ],
//                     rows: [
//                         {
//                             value: "overall_school_performance",
//                             text: "Overall school performance",
//                         },
//                         { value: "reading", text: "Reading" },
//                         { value: "writing", text: "Writing" },
//                         { value: "mathematics", text: "Mathematics" },
//                         {
//                             value: "relationship_with_parents",
//                             text: "Relationship with parents",
//                         },
//                         {
//                             value: "relationship_with_siblings",
//                             text: "Relationship with siblings",
//                         },
//                         {
//                             value: "relationship_with_peers",
//                             text: "Relationship with peers",
//                         },
//                         {
//                             value: "participation_organized_activities",
//                             text: "Participation in organized activities (eg, teams)",
//                         },
//                     ],
//                 },
//                 {
//                     type: "comment",
//                     name: "comments",
//                     title: "Comments",
//                 },
//             ],
//         },
//         {
//             name: "medication_informed_consent",
//             title: "Medication Informed Consent Form",
//             elements: [
//                 {
//                     type: "html",
//                     name: "medication_informed_consent_content",
//                     title: "Medication Informed Consent Form",
//                     isCollapsed: true,
//                     html: `
//               <h4>Medication Informed Consent Form</h4>
//               <p>Four Square Clinicals needs to maintain a written record of your decision to consent to the administration of psychotropic medications. You may be treated with psychotropic medication only after you have been informed of your right to accept or refuse such medications. In order to allow you to make an informed decision, your physician must have provided to you sufficient information regarding the proposed psychotropic medication, which shall include the following:</p>
//               <ol>
//                 <li>The nature of your psychiatric condition.</li>
//                 <li>The reason for taking such medication, including the likelihood of your improving or not improving without such medication, and that your consent, once given, may be withdrawn at any time by your stating such intentions to your physician.</li>
//                 <li>The reasonable alternative treatments available, if any.</li>
//                 <li>The type, range of frequency, amount, and duration of taking the medications.</li>
//                 <li>The probable side effects of these medications known to commonly occur, risks, as well as expected benefits, and approximate time course to improvement.</li>
//                 <li>The possible additional side effects which may occur if you take such medication beyond three months. (specifically, neuroleptics/antipsychotics). You should have been advised that such side effects may include persistent involuntary movement of the face, mouth or might at times include similar movement of the hands and feet, and that these symptoms known as tardive dyskinesia are potentially irreversible and may appear after medications have been discontinued.</li>
//               </ol>
//               <p>It is important to not abruptly stop any medication without first discussing it with your physician. You must understand that combining alcohol and/or illicit drugs with medications is potentially dangerous and not advised by your physician.</p>
//               <p>The original and/or subsequent class(es) of medication(s) discussed, and recommended by your provider is/are:</p>
//               <ul>
//                 <li>Antipsychotics/Neuroleptics</li>
//                 <li>Antidepressant</li>
//                 <li>MAO Inhibitors Antidepressants</li>
//                 <li>Anxiolytics/Sedatives</li>
//                 <li>Benzodiazepines/Hypnotics</li>
//                 <li>Stimulants</li>
//                 <li>Mood Stabilizers/Antiepileptic</li>
//                 <li>Antiparkinson agents</li>
//                 <li>Lithium</li>
//                 <li>Other:</li>
//               </ul>
//               <p>The general side effect profile(s) of the above medication(s) have been reviewed with me and could include some specifically from the list below:</p>
//               <ul>
//                 <li>Insomnia</li>
//                 <li>Diarrhea/Constipation</li>
//                 <li>Motor changes/EPS</li>
//                 <li>Headaches</li>
//                 <li>Weight gain/loss</li>
//                 <li>Glaucoma</li>
//                 <li>Sedation/Stimulation</li>
//                 <li>Cardiac conduction changes</li>
//                 <li>Stroke</li>
//                 <li>Drowsiness</li>
//                 <li>Confusion</li>
//                 <li>Nausea/Vomiting</li>
//                 <li>Changes in blood pressure</li>
//                 <li>Dry mouth</li>
//                 <li>Dizziness</li>
//                 <li>Elevated cholesterol/triglycerides</li>
//                 <li>Liver inflammation</li>
//                 <li>Seizures</li>
//                 <li>Hypothyroidism</li>
//                 <li>Renal impairment</li>
//                 <li>Diabetes/elevated glucose</li>
//                 <li>Hyponatremia</li>
//                 <li>Congenital abnormalities to fetus</li>
//               </ul>
//               <p>Your signature below constitutes your acknowledgement:</p>
//               <ul>
//                 <li>That you have read and agree to the forgoing.</li>
//                 <li>That the medications and treatment set forth above have been adequately explained and/or discussed with you by your physician, and that you have received all the information you desire concerning such medication and treatment.</li>
//                 <li>That if you encounter side effects or difficulties with this/these medication(s) you will contact your physician or your pharmacist.</li>
//                 <li>That if you have a reason to believe you have become pregnant (if applicable) while on medication, you will contact your physician immediately.</li>
//                 <li>That you authorize and consent to the administration of such medication and treatment.</li>
//               </ul>
//             `,
//                 },
//                 {
//                     type: "text",
//                     name: "patient_signature",
//                     title: "Signature",
//                 },
//                 {
//                     type: "text",
//                     name: "signature_date",
//                     title: "Date",
//                 },
//                 {
//                     type: "text",
//                     name: "patient_full_name",
//                     title: "Printed Full Name of Patient",
//                 },
//             ],
//         },
//         {
//             name: "patient_health_questionnaire",
//             title: "Patient Health Questionnaire-9 (PHQ-9)",
//             elements: [
//                 {
//                     type: "matrix",
//                     name: "phq9_questions",
//                     title: "Over the last 2 weeks, how often have you been bothered by any of the following problems? (Use “✔” to indicate your answer)",
//                     columns: [
//                         { value: "not_at_all", text: "Not at all" },
//                         { value: "several_days", text: "Several days" },
//                         {
//                             value: "more_than_half",
//                             text: "More than half the days",
//                         },
//                         {
//                             value: "nearly_every_day",
//                             text: "Nearly every day",
//                         },
//                     ],
//                     rows: [
//                         {
//                             value: "little_interest",
//                             text: "Little interest or pleasure in doing things",
//                         },
//                         {
//                             value: "feeling_down",
//                             text: "Feeling down, depressed, or hopeless",
//                         },
//                         {
//                             value: "trouble_sleeping",
//                             text: "Trouble falling or staying asleep, or sleeping too much",
//                         },
//                         {
//                             value: "feeling_tired",
//                             text: "Feeling tired or having little energy",
//                         },
//                         {
//                             value: "poor_appetite",
//                             text: "Poor appetite or overeating",
//                         },
//                         {
//                             value: "feeling_bad_about_self",
//                             text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
//                         },
//                         {
//                             value: "trouble_concentrating",
//                             text: "Trouble concentrating on things, such as reading the newspaper or watching television",
//                         },
//                         {
//                             value: "slow_movement",
//                             text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
//                         },
//                         {
//                             value: "thoughts_of_self_harm",
//                             text: "Thoughts that you would be better off dead or of hurting yourself in some way",
//                         },
//                     ],
//                 },
//                 {
//                     type: "radiogroup",
//                     name: "difficulty_problems",
//                     title: "If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
//                     choices: [
//                         "Not difficult at all",
//                         "Somewhat difficult",
//                         "Very difficult",
//                         "Extremely difficult",
//                     ],
//                 },
//                 {
//                     type: "text",
//                     name: "phq9_total_score",
//                     title: "Total Score",
//                 },
//             ],
//         },
//         {
//             name: "drug_screening_questionnaire",
//             title: "Drug Screening Questionnaire (DAST)",
//             elements: [
//                 {
//                     type: "checkbox",
//                     name: "recreational_drugs_used",
//                     title: "Which recreational drugs have you used in the past year? (Check all that apply)",
//                     choices: [
//                         "Methamphetamines (speed, crystal)",
//                         "Cocaine",
//                         "Cannabis (marijuana, pot)",
//                         "Narcotics (heroin, oxycodone, methadone, etc.)",
//                         "Inhalants (paint thinner, aerosol, glue)",
//                         "Hallucinogens (LSD, mushrooms)",
//                         "Tranquilizers (valium)",
//                         "Other",
//                     ],
//                 },
//                 {
//                     type: "radiogroup",
//                     name: "frequency_drug_use",
//                     title: "How often have you used these drugs?",
//                     choices: [
//                         "Monthly or less",
//                         "Weekly",
//                         "Daily or almost daily",
//                     ],
//                 },
//                 {
//                     type: "radiogroup",
//                     name: "dast_questions",
//                     title: "DAST Questions",
//                     choices: ["No", "Yes"],
//                     rows: [
//                         "Have you used drugs other than those required for medical reasons?",
//                         "Do you abuse (use) more than one drug at a time?",
//                         "Are you unable to stop using drugs when you want to?",
//                         "Have you ever had blackouts or flashbacks as a result of drug use?",
//                         "Do you ever feel bad or guilty about your drug use?",
//                         "Does your spouse (or parents) ever complain about your involvement with drugs?",
//                         "Have you neglected your family because of your use of drugs?",
//                         "Have you engaged in illegal activities in order to obtain drugs?",
//                         "Have you ever experienced withdrawal symptoms (felt sick) when you stopped taking drugs?",
//                         "Have you had medical problems as a result of your drug use (e.g. memory loss, hepatitis, convulsions, bleeding)?",
//                     ],
//                 },
//                 {
//                     type: "radiogroup",
//                     name: "inject_drugs",
//                     title: "Do you inject drugs?",
//                     choices: ["No", "Yes"],
//                 },
//                 {
//                     type: "radiogroup",
//                     name: "drug_treatment",
//                     title: "Have you ever been in treatment for a drug problem?",
//                     choices: ["No", "Yes"],
//                 },
//                 {
//                     type: "text",
//                     name: "dast_score",
//                     title: "Total Score",
//                 },
//                 {
//                     type: "html",
//                     name: "dast_explanation",
//                     title: "Explanation of DAST Score",
//                     isCollapsed: true,
//                     html: `
//               <h4>Explanation of DAST Score:</h4>
//               <ul>
//                 <li>0: Low Risk</li>
//                 <li>1-2: Risky</li>
//                 <li>3-5: Harmful</li>
//                 <li>6-10: Severe</li>
//               </ul>
//             `,
//                 },
//             ],
//         },
//         {
//             name: "consent_release_information",
//             title: "Consent for the Release of Information under 42 C.F.R. PART 2",
//             elements: [
//                 {
//                     type: "text",
//                     name: "patient_authorization",
//                     title: "I, (Name of patient), authorize (Name of provider)",
//                 },
//                 {
//                     type: "checkbox",
//                     name: "release_information",
//                     title: "I authorize the release or disclosure of the substance use disorder records below:",
//                     choices: [
//                         "All my substance use disorder records",
//                         "Attendance",
//                         "Toxicology Results",
//                         "Medication(s)/dosing",
//                         "Assessments",
//                         "Progress in Treatment",
//                         "Treatment plan",
//                         "Lab results",
//                         "Appointments",
//                         "Diagnostic information",
//                         "Insurance info/demographics",
//                         "Discharge Summary",
//                         "Substance Use History",
//                         "Trauma History Summary",
//                         "Other",
//                     ],
//                 },
//                 {
//                     type: "text",
//                     name: "release_to_person",
//                     title: "To: (Name of person or organization to which disclosure is to be made)",
//                 },
//                 {
//                     type: "text",
//                     name: "release_to_phone",
//                     title: "Phone",
//                 },
//                 {
//                     type: "text",
//                     name: "release_to_fax",
//                     title: "Fax",
//                 },
//                 {
//                     type: "checkbox",
//                     name: "purpose_of_disclosure",
//                     title: "For (purpose of disclosure):",
//                     choices: [
//                         "Continuity of Care",
//                         "Coordinating Treatment",
//                         "Payment/benefits administration",
//                         "Other",
//                     ],
//                 },
//                 {
//                     type: "text",
//                     name: "specific_date_event",
//                     title: "If not previously revoked, this consent will terminate either in one year from the date of signature OR 90 days after discharge (whichever comes first); OR upon a specific date, event, or condition as listed here:",
//                 },
//                 {
//                     type: "text",
//                     name: "patient_signature",
//                     title: "Patient’s Signature",
//                 },
//                 {
//                     type: "text",
//                     name: "patient_signature_date",
//                     title: "Date",
//                 },
//                 {
//                     type: "text",
//                     name: "patient_name",
//                     title: "Print Name",
//                 },
//                 {
//                     type: "text",
//                     name: "patient_dob",
//                     title: "Date of Birth (MM/DD/YY)",
//                 },
//                 {
//                     type: "text",
//                     name: "representative_signature",
//                     title: "Signature of Personal Representative",
//                 },
//                 {
//                     type: "text",
//                     name: "representative_name",
//                     title: "Print",
//                 },
//                 {
//                     type: "text",
//                     name: "representative_date",
//                     title: "Date",
//                 },
//                 {
//                     type: "text",
//                     name: "legal_authority",
//                     title: "Legal Authority",
//                 },
//             ],
//         },
//         {
//             name: "ptsd_checklist_civilian",
//             title: "PTSD Checklist - Civilian Version (PCL-C)",
//             elements: [
//                 {
//                     type: "text",
//                     name: "client_name",
//                     title: "Client's Name",
//                 },
//                 {
//                     type: "matrix",
//                     name: "ptsd_questions",
//                     title: "Instruction to patient: Below is a list of problems and complaints that veterans sometimes have in response to stressful life experiences. Please read each one carefully, put an “X” in the box to indicate how much you have been bothered by that problem in the last month.",
//                     columns: [
//                         { value: "not_at_all", text: "Not at all (1)" },
//                         { value: "a_little_bit", text: "A little bit (2)" },
//                         { value: "moderately", text: "Moderately (3)" },
//                         { value: "quite_a_bit", text: "Quite a bit (4)" },
//                         { value: "extremely", text: "Extremely (5)" },
//                     ],
//                     rows: [
//                         {
//                             value: "repeated_memories",
//                             text: "Repeated, disturbing memories, thoughts, or images of a stressful experience from the past?",
//                         },
//                         {
//                             value: "repeated_dreams",
//                             text: "Repeated, disturbing dreams of a stressful experience from the past?",
//                         },
//                         {
//                             value: "suddenly_feeling",
//                             text: "Suddenly acting or feeling as if a stressful experience were happening again (as if you were reliving it)?",
//                         },
//                         {
//                             value: "very_upset",
//                             text: "Feeling very upset when something reminded you of a stressful experience from the past?",
//                         },
//                         {
//                             value: "physical_reactions",
//                             text: "Having physical reactions (e.g., heart pounding, trouble breathing, or sweating) when something reminded you of a stressful experience from the past?",
//                         },
//                         {
//                             value: "avoid_thinking",
//                             text: "Avoid thinking about or talking about a stressful experience from the past or avoid having feelings related to it?",
//                         },
//                         {
//                             value: "avoid_activities",
//                             text: "Avoid activities or situations because they remind you of a stressful experience from the past?",
//                         },
//                         {
//                             value: "trouble_remembering",
//                             text: "Trouble remembering important parts of a stressful experience from the past?",
//                         },
//                         {
//                             value: "loss_interest",
//                             text: "Loss of interest in things that you used to enjoy?",
//                         },
//                         {
//                             value: "feeling_distant",
//                             text: "Feeling distant or cut off from other people?",
//                         },
//                         {
//                             value: "feeling_numb",
//                             text: "Feeling emotionally numb or being unable to have loving feelings for those close to you?",
//                         },
//                         {
//                             value: "feeling_short_future",
//                             text: "Feeling as if your future will somehow be cut short?",
//                         },
//                         {
//                             value: "trouble_sleeping",
//                             text: "Trouble falling or staying asleep?",
//                         },
//                         {
//                             value: "feeling_irritable",
//                             text: "Feeling irritable or having angry outbursts?",
//                         },
//                         {
//                             value: "difficulty_concentrating",
//                             text: "Having difficulty concentrating?",
//                         },
//                         {
//                             value: "super_alert",
//                             text: "Being “super alert” or watchful on guard?",
//                         },
//                         {
//                             value: "feeling_jumpy",
//                             text: "Feeling jumpy or easily startled?",
//                         },
//                     ],
//                 },
//             ],
//         },
//         {
//             name: "cage_questionnaire",
//             title: "CAGE Questionnaire",
//             elements: [
//                 {
//                     type: "radiogroup",
//                     name: "cut_down",
//                     title: "Have you ever felt you should Cut down on your drinking?",
//                     choices: ["Yes", "No"],
//                 },
//                 {
//                     type: "radiogroup",
//                     name: "annoyed",
//                     title: "Have people Annoyed you by criticizing your drinking?",
//                     choices: ["Yes", "No"],
//                 },
//                 {
//                     type: "radiogroup",
//                     name: "guilty",
//                     title: "Have you ever felt bad or Guilty about your drinking?",
//                     choices: ["Yes", "No"],
//                 },
//                 {
//                     type: "radiogroup",
//                     name: "eye_opener",
//                     title: "Have you ever had a drink first thing in the morning to steady your nerves or to get rid of a hangover (Eye opener)?",
//                     choices: ["Yes", "No"],
//                 },
//                 {
//                     type: "html",
//                     name: "cage_explanation",
//                     title: "Scoring",
//                     isCollapsed: true,
//                     html: `
//               <h4>Scoring:</h4>
//               <p>Item responses on the CAGE are scored 0 or 1, with a higher score an indication of alcohol problems. A total score of 2 or greater is considered clinically significant.</p>
//             `,
//                 },
//             ],
//         },
//         {
//             name: "intake_packet_medical_history",
//             title: "Four Square Clinicals Intake Packet - Past Medical History",
//             elements: [
//                 {
//                     type: "checkbox",
//                     name: "medical_conditions",
//                     title: "Medical Conditions",
//                     choices: [
//                         "Circulation Problem",
//                         "Diabetes",
//                         "Heart Disease",
//                         "High Blood Pressure",
//                         "Palpitations",
//                         "Stroke",
//                         "Fibromyalgia",
//                         "Cancer",
//                         "Other",
//                     ],
//                 },
//                 {
//                     type: "checkbox",
//                     name: "neurovascular",
//                     title: "Neurovascular",
//                     choices: [
//                         "Aneurysm with clipping",
//                         "Shunts/Implants",
//                         "Hearing Loss",
//                         "Tinnitus (Ringing in the ears)",
//                         "Dizziness",
//                         "Fainting",
//                     ],
//                 },
//                 {
//                     type: "checkbox",
//                     name: "neurological_psychological",
//                     title: "Neurological/Psychological",
//                     choices: [
//                         "Addiction",
//                         "Anxiety",
//                         "Brain Fog",
//                         "Depression",
//                         "Insomnia",
//                         "Memory Problems",
//                         "Sleep Apnea",
//                         "Vertigo",
//                     ],
//                 },
//                 {
//                     type: "checkbox",
//                     name: "pain",
//                     title: "Pain",
//                     choices: [
//                         "Arthritis",
//                         "Ankle",
//                         "Chest",
//                         "Hip",
//                         "Knee",
//                         "Leg",
//                         "Lower Back",
//                         "Mid Back",
//                         "Neck",
//                         "Wrist/Hand",
//                     ],
//                 },
//                 {
//                     type: "text",
//                     name: "other_conditions",
//                     title: "Other medical conditions or concerns?",
//                 },
//             ],
//         },
//         {
//             name: "current_medications",
//             title: "Current Medications",
//             elements: [
//                 {
//                     type: "matrixdynamic",
//                     name: "medications",
//                     title: "Medication Name",
//                     columns: [
//                         {
//                             name: "medication_name",
//                             title: "Medication Name",
//                             cellType: "dropdown",
//                             choices: [
//                                 "Antipsychotics/Neuroleptics",
//                                 "Antidepressant",
//                                 "MAO Inhibitors Antidepressants",
//                                 "Anxiolytics/Sedatives",
//                                 "Benzodiazepines/Hypnotics",
//                                 "Stimulants",
//                                 "Mood Stabilizers/Antiepileptic",
//                                 "Antiparkinson agents",
//                                 "Lithium",
//                                 "Other",
//                             ],
//                         },
//                         {
//                             name: "dose",
//                             title: "Dose",
//                             cellType: "text",
//                         },
//                         {
//                             name: "frequency",
//                             title: "Frequency",
//                             cellType: "text",
//                         },
//                     ],
//                     rowCount: 5,
//                 },
//             ],
//         },
//         {
//             name: "current_allergies",
//             title: "Current Allergies",
//             elements: [
//                 {
//                     type: "matrixdynamic",
//                     name: "allergies",
//                     title: "Allergy Name",
//                     columns: [
//                         {
//                             name: "allergy_name",
//                             title: "Allergy Name",
//                             cellType: "text",
//                         },
//                         {
//                             name: "reaction",
//                             title: "Reaction",
//                             cellType: "text",
//                         },
//                     ],
//                     rowCount: 3,
//                 },
//                 {
//                     type: "checkbox",
//                     name: "no_current_medications",
//                     title: "",
//                     choices: ["No current medications"],
//                 },
//                 {
//                     type: "checkbox",
//                     name: "no_known_drug_allergies",
//                     title: "",
//                     choices: ["No Known Drug Allergies"],
//                 },
//             ],
//         },
//         {
//             name: "past_surgical_history",
//             title: "Past Surgical History",
//             elements: [
//                 {
//                     type: "checkbox",
//                     name: "no_surgical_history",
//                     title: "",
//                     choices: [
//                         "I have NEVER had any surgical procedures performed",
//                     ],
//                 },
//                 {
//                     type: "matrixdynamic",
//                     name: "surgical_procedures",
//                     title: "Please list any surgical procedures you have had done in the past including date:",
//                     columns: [
//                         {
//                             name: "procedure_name",
//                             title: "Procedure Name",
//                             cellType: "text",
//                         },
//                         {
//                             name: "procedure_date",
//                             title: "Date",
//                             cellType: "text",
//                         },
//                     ],
//                     rowCount: 3,
//                 },
//             ],
//         },
//         {
//             name: "family_history",
//             title: "Family History",
//             elements: [
//                 {
//                     type: "checkbox",
//                     name: "no_family_history",
//                     title: "",
//                     choices: ["No Family History"],
//                 },
//                 {
//                     type: "checkbox",
//                     name: "medical_conditions_family",
//                     title: "Medical Conditions",
//                     choices: [
//                         "Arthritis",
//                         "Osteoporosis",
//                         "Headaches/migraines",
//                         "Dementia",
//                         "Liver problems",
//                         "Diabetes",
//                         "Seizures",
//                         "Kidney Problems",
//                         "Cancer",
//                         "Mental Health Condition(s)",
//                         "Asthma",
//                         "High Cholesterol",
//                         "Other",
//                     ],
//                 },
//                 {
//                     type: "checkbox",
//                     name: "muscle_bone_family",
//                     title: "Muscle/Bone",
//                     choices: [
//                         "Fibromyalgia",
//                         "Rheumatoid Arthritis",
//                         "Bone Fractures",
//                     ],
//                 },
//                 {
//                     type: "checkbox",
//                     name: "vascular_family",
//                     title: "Vascular",
//                     choices: [
//                         "Heart Problems",
//                         "Stroke",
//                         "Circulation Problem",
//                         "Palpitations",
//                     ],
//                 },
//                 {
//                     type: "text",
//                     name: "other_conditions_family",
//                     title: "Other medical conditions or concerns?",
//                 },
//             ],
//         },
//         {
//             name: "insurance_information",
//             title: "Insurance Information",
//             elements: [
//                 {
//                     type: "text",
//                     name: "primary_insurance",
//                     title: "Primary Insurance",
//                 },
//                 {
//                     type: "text",
//                     name: "primary_subscriber_name",
//                     title: "Subscriber Name",
//                 },
//                 {
//                     type: "text",
//                     name: "primary_dob",
//                     title: "Subscriber DOB",
//                 },
//                 {
//                     type: "text",
//                     name: "primary_relationship",
//                     title: "Relationship to Subscriber",
//                 },
//                 {
//                     type: "text",
//                     name: "primary_policy_number",
//                     title: "Policy Number",
//                 },
//                 {
//                     type: "text",
//                     name: "primary_group_number",
//                     title: "Group Number",
//                 },
//                 {
//                     type: "text",
//                     name: "secondary_insurance",
//                     title: "Secondary Insurance",
//                 },
//                 {
//                     type: "text",
//                     name: "secondary_subscriber_name",
//                     title: "Subscriber Name",
//                 },
//                 {
//                     type: "text",
//                     name: "secondary_dob",
//                     title: "Subscriber DOB",
//                 },
//                 {
//                     type: "text",
//                     name: "secondary_relationship",
//                     title: "Relationship to Subscriber",
//                 },
//                 {
//                     type: "text",
//                     name: "secondary_policy_number",
//                     title: "Policy Number",
//                 },
//                 {
//                     type: "text",
//                     name: "secondary_group_number",
//                     title: "Group Number",
//                 },
//             ],
//         },
//         {
//             name: "acknowledgement_of_privacy",
//             title: "Acknowledgement of Receipt of Notice of Privacy Practices",
//             elements: [
//                 {
//                     type: "html",
//                     name: "privacy_acknowledgement_content",
//                     title: "Privacy Practices",
//                     isCollapsed: true,
//                     html: `
//               <p>Patient Acknowledgement: I understand that as part of my healthcare, Four Square Clinicals originates and maintains health records describing my health history, symptoms, diagnosis, treatment, and any plans for future care or treatment. I understand that this information serves as:</p>
//               <ul>
//                 <li>A basis for planning my care and treatment</li>
//                 <li>A means of communication among the health professionals who contribute to my care</li>
//                 <li>A source of information for applying my diagnosis and surgical information to my bill</li>
//                 <li>A means by which a third-party payer can verify that services billed were actually provided</li>
//                 <li>A tool for routine healthcare operations such as assessing quality and reviewing the competence of healthcare professionals</li>
//               </ul>
//               <p>I have been provided with a Notice of Privacy Practices that provides a more complete description of information uses and disclosures. I understand that I have the following rights and privileges:</p>
//               <ul>
//                 <li>The right to review the notice prior to signing this consent</li>
//                 <li>The right to object to the use of my health information for directory purposes</li>
//                 <li>The right to request restrictions as to how my health information may be used or disclosed to carry out treatment, payment, or healthcare operations</li>
//               </ul>
//               <p>I understand that Four Square Clinicals is not required to agree to the restrictions requested. I understand that I may revoke this consent in writing, except to the extent that the organization has already taken action in reliance thereon. I also understand that by refusing to sign this consent or revoking this consent, this organization may refuse to treat me as permitted by Section 164.506 of the Code of Federal Regulations. I further understand that Four Square Clinicals reserves the right to change their notice and practices, and prior to implementation, in accordance with Section 164.520 of the Code of Federal Regulations. Should Four Square Clinicals change their notice, they will send a copy of any revised notice to the address I’ve provided (whether U.S. mail or, if I agree, email). I understand that as part of this organization’s treatment, payment, or healthcare operations, it may become necessary to disclose my protected health information to another entity, and I consent to such disclosure for these permitted uses, including disclosures via fax.</p>
//               <p>I fully understand and accept the terms of this consent.</p>
//             `,
//                 },
//                 {
//                     type: "text",
//                     name: "patient_signature",
//                     title: "Signature of Patient or Legal Representative",
//                 },
//                 {
//                     type: "text",
//                     name: "patient_signature_date",
//                     title: "Date",
//                 },
//                 {
//                     type: "text",
//                     name: "relationship",
//                     title: "Relationship (if Legal Representative)",
//                 },
//             ],
//         },
//         {
//             name: "patient_rights_responsibilities",
//             title: "Patient Rights and Responsibilities",
//             elements: [
//                 {
//                     type: "html",
//                     name: "patient_rights_responsibilities_content",
//                     title: "Patient Rights and Responsibilities",
//                     isCollapsed: true,
//                     html: `
//               <h4>Patient Rights and Responsibilities</h4>
//               <p>We at Four Square Clinicals recognize that you have certain rights and responsibilities as a patient receiving behavioral health services from us. We have provided the following information to help you understand what those rights and responsibilities are:</p>
//               <h5>Patient Rights</h5>
//               <ul>
//                 <li>You have the right to be treated with dignity and respect.</li>
//                 <li>You have the right to be informed about your treatment and to participate in the planning of your care.</li>
//                 <li>You have the right to privacy and confidentiality regarding your care and treatment.</li>
//                 <li>You have the right to be informed of the fees and payment policies for services provided.</li>
//                 <li>You have the right to receive treatment that is free from discrimination.</li>
//               </ul>
//               <h5>Patient Responsibilities</h5>
//               <ul>
//                 <li>You are responsible for providing accurate and complete information about your health and medical history.</li>
//                 <li>You are responsible for following the treatment plan recommended by your healthcare provider.</li>
//                 <li>You are responsible for informing your healthcare provider if you do not understand your treatment plan or if you are unable to follow it.</li>
//                 <li>You are responsible for keeping your appointments and for notifying the office if you need to cancel or reschedule.</li>
//                 <li>You are responsible for paying for the services provided in accordance with the fees and payment policies.</li>
//               </ul>
//               <p>By signing below, you acknowledge that you have read and understand your rights and responsibilities as a patient receiving services from Four Square Clinicals.</p>
//             `,
//                 },
//                 {
//                     type: "text",
//                     name: "patient_signature",
//                     title: "Signature of Patient or Legal Representative",
//                 },
//                 {
//                     type: "text",
//                     name: "patient_signature_date",
//                     title: "Date",
//                 },
//                 {
//                     type: "text",
//                     name: "relationship",
//                     title: "Relationship (if Legal Representative)",
//                 },
//             ],
//         },
//         {
//             name: "limitations_of_confidentiality",
//             title: "Limits of Confidentiality",
//             elements: [
//                 {
//                     type: "html",
//                     name: "limitations_confidentiality_content",
//                     title: "Limits of Confidentiality",
//                     isCollapsed: true,
//                     html: `
//               <h4>Limits of Confidentiality</h4>
//               <p>Information disclosed in therapy is generally confidential and is protected by state and federal laws. However, there are certain circumstances under which confidentiality may be limited:</p>
//               <ul>
//                 <li>If there is reason to believe that a child, elderly person, or disabled person is being abused or neglected.</li>
//                 <li>If there is a risk of imminent harm to yourself or others.</li>
//                 <li>If you provide written consent to release your information.</li>
//                 <li>If records are subpoenaed by a court of law.</li>
//               </ul>
//               <p>By signing below, you acknowledge that you have read and understand the limits of confidentiality as described above.</p>
//             `,
//                 },
//                 {
//                     type: "text",
//                     name: "patient_signature",
//                     title: "Signature of Patient or Legal Representative",
//                 },
//                 {
//                     type: "text",
//                     name: "patient_signature_date",
//                     title: "Date",
//                 },
//                 {
//                     type: "text",
//                     name: "relationship",
//                     title: "Relationship (if Legal Representative)",
//                 },
//             ],
//         },
//         {
//             name: "policy_agreement",
//             title: "Policy Agreement",
//             elements: [
//                 {
//                     type: "html",
//                     name: "policy_agreement_content",
//                     title: "Policy Agreement",
//                     isCollapsed: true,
//                     html: `
//               <h4>Policy Agreement</h4>
//               <p>Please read and sign below indicating your agreement to the following policies:</p>
//               <ul>
//                 <li><strong>Appointments:</strong> It is your responsibility to attend scheduled appointments. If you need to cancel or reschedule, please do so at least 24 hours in advance.</li>
//                 <li><strong>Payment:</strong> Payment is due at the time of service unless other arrangements have been made. We accept cash, check, and credit cards.</li>
//                 <li><strong>Insurance:</strong> If you have insurance, we will file claims on your behalf. However, you are responsible for any co-pays, deductibles, or non-covered services.</li>
//                 <li><strong>Confidentiality:</strong> Your records are confidential and will not be released without your written consent, except as required by law.</li>
//               </ul>
//             `,
//                 },
//                 {
//                     type: "text",
//                     name: "patient_signature",
//                     title: "Signature of Patient or Legal Representative",
//                 },
//                 {
//                     type: "text",
//                     name: "patient_signature_date",
//                     title: "Date",
//                 },
//                 {
//                     type: "text",
//                     name: "relationship",
//                     title: "Relationship (if Legal Representative)",
//                 },
//             ],
//         },
//         {
//             name: "local_24_hour_access",
//             title: "Local 24-Hour Access Information",
//             elements: [
//                 {
//                     type: "html",
//                     name: "local_24_hour_access_content",
//                     title: "Local 24-Hour Access Information",
//                     isCollapsed: true,
//                     html: `
//               <h4>Local 24-Hour Access Information</h4>
//               <p>For emergency assistance, please use the following resources:</p>
//               <ul>
//                 <li><strong>Emergency Services:</strong> Dial 911</li>
//                 <li><strong>Local Crisis Hotline:</strong> [Insert Local Crisis Hotline Number]</li>
//                 <li><strong>Nearest Hospital:</strong> [Insert Nearest Hospital Name and Address]</li>
//                 <li><strong>Local Police Department:</strong> [Insert Local Police Department Name and Phone Number]</li>
//               </ul>
//               <p>If you need to contact our office outside of regular business hours, please call [Insert After-Hours Contact Information].</p>
//             `,
//                 },
//                 {
//                     type: "text",
//                     name: "patient_signature",
//                     title: "Signature of Patient or Legal Representative",
//                 },
//                 {
//                     type: "text",
//                     name: "patient_signature_date",
//                     title: "Date",
//                 },
//                 {
//                     type: "text",
//                     name: "relationship",
//                     title: "Relationship (if Legal Representative)",
//                 },
//             ],
//         },
//     ],
// };

export const fsclinicalsForm = {
    title: "Four Square Clinicals Forms",
    description:
        "Your privacy is important to us. All information is subject to our Patient Privacy Policy.",
    width: 1024,
    height: 1024,
    completedHtml:
        '<div style="max-width:540px;text-align:left;margin:0 auto;padding:40px 48px;background-color:#fff;border:1px solid rgba(0,0,0,0.25);"><h4>Thank you for completing your patient registration form.</h4><p>Dear {first_name},<br><br>Your information has been successfully received. We look forward to providing you with the highest level of care.<br><br>If you have any questions or need to schedule an appointment, please contact our office.<br><br>Warm regards,<br>Four Square Clinicals</p></div>',
    pages: [
        {
            name: "patient_information",
            title: "Patient Information",
            elements: [
                {
                    type: "panel",
                    name: "basic_info",
                    title: "Basic Information",
                    elements: [
                        {
                            type: "text",
                            name: "last_name",
                            title: "Last Name",
                            width: "50%",
                            minWidth: "256px",
                            //isRequired: true,
                        },
                        {
                            type: "text",
                            name: "first_name",
                            title: "First Name",
                            width: "50%",
                            minWidth: "256px",
                            //isRequired: true,
                            startWithNewLine: false,
                        },
                        {
                            type: "text",
                            name: "middle_initial",
                            title: "MI",
                            width: "50%",
                            minWidth: "256px",
                        },
                        {
                            type: "text",
                            name: "dob",
                            title: "DOB",
                            inputType: "date",
                            width: "50%",
                            minWidth: "256px",
                            startWithNewLine: false,
                            //isRequired: true,
                        },
                        {
                            type: "text",
                            name: "address",
                            title: "Address",
                            width: "100%",
                            minWidth: "256px",
                        },
                        {
                            type: "text",
                            name: "city",
                            title: "City",
                            width: "33%",
                            minWidth: "128px",
                        },
                        {
                            type: "dropdown",
                            name: "state",
                            title: "State",
                            choices: [
                                "Alabama",
                                "Alaska",
                                "Arizona",
                                "Arkansas",
                                "California",
                                "Colorado",
                                "Connecticut",
                                "Delaware",
                                "Florida",
                                "Georgia",
                                "Hawaii",
                                "Idaho",
                                "Illinois",
                                "Indiana",
                                "Iowa",
                                "Kansas",
                                "Kentucky",
                                "Louisiana",
                                "Maine",
                                "Maryland",
                                "Massachusetts",
                                "Michigan",
                                "Minnesota",
                                "Mississippi",
                                "Missouri",
                                "Montana",
                                "Nebraska",
                                "Nevada",
                                "New Hampshire",
                                "New Jersey",
                                "New Mexico",
                                "New York",
                                "North Carolina",
                                "North Dakota",
                                "Ohio",
                                "Oklahoma",
                                "Oregon",
                                "Pennsylvania",
                                "Rhode Island",
                                "South Carolina",
                                "South Dakota",
                                "Tennessee",
                                "Texas",
                                "Utah",
                                "Vermont",
                                "Virginia",
                                "Washington",
                                "West Virginia",
                                "Wisconsin",
                                "Wyoming",
                                "District of Columbia",
                            ],
                            width: "33%",
                            minWidth: "128px",
                            startWithNewLine: false,
                        },
                        {
                            type: "text",
                            name: "zip",
                            inputType: "number",
                            title: "Zip Code",
                            width: "34%",
                            minWidth: "128px",
                            startWithNewLine: false,
                        },
                        {
                            type: "text",
                            name: "telephone",
                            title: "Telephone",
                            inputType: "tel",
                            width: "50%",
                            minWidth: "256px",
                        },
                        {
                            type: "text",
                            name: "email",
                            title: "Email",
                            inputType: "email",
                            width: "50%",
                            minWidth: "256px",
                            startWithNewLine: false,
                        },
                    ],
                },
            ],
        },
        {
            name: "authorization_release",
            title: "Authorization for Use or Disclosure of Behavioral Health Record",
            elements: [
                {
                    type: "panel",
                    name: "release_information",
                    title: "Release Information",
                    elements: [
                        {
                            type: "text",
                            name: "release_from",
                            title: "Release From: Person/Entity",
                            width: "50%",
                            minWidth: "256px",
                        },
                        {
                            type: "text",
                            name: "release_from_address",
                            title: "Address",
                            width: "50%",
                            minWidth: "256px",
                            startWithNewLine: false,
                        },
                        {
                            type: "text",
                            name: "release_from_city",
                            title: "City/State/Zip",
                            width: "50%",
                            minWidth: "256px",
                        },
                        {
                            type: "text",
                            name: "release_from_phone",
                            title: "Phone",
                            inputType: "tel",
                            width: "50%",
                            minWidth: "256px",
                            startWithNewLine: false,
                        },
                        {
                            type: "text",
                            name: "release_from_fax",
                            title: "Fax",
                            inputType: "tel",
                            width: "50%",
                            minWidth: "256px",
                        },
                        {
                            type: "text",
                            name: "release_to",
                            title: "Release To: Person/Entity",
                            width: "50%",
                            minWidth: "256px",
                        },
                        {
                            type: "text",
                            name: "release_to_address",
                            title: "Address",
                            width: "50%",
                            minWidth: "256px",
                            startWithNewLine: false,
                        },
                        {
                            type: "text",
                            name: "release_to_city",
                            title: "City/State/Zip",
                            width: "50%",
                            minWidth: "256px",
                        },
                        {
                            type: "text",
                            name: "release_to_phone",
                            title: "Phone",
                            inputType: "tel",
                            width: "50%",
                            minWidth: "256px",
                            startWithNewLine: false,
                        },
                        {
                            type: "text",
                            name: "release_to_fax",
                            title: "Fax",
                            inputType: "tel",
                            width: "50%",
                            minWidth: "256px",
                        },
                        {
                            type: "checkbox",
                            name: "release_purpose",
                            title: "Purpose",
                            choices: [
                                "Continuing Treatment",
                                "Legal",
                                "Insurance",
                                "Personal Use",
                                "Other",
                            ],
                            colCount: 1,
                        },
                    ],
                },
                {
                    type: "panel",
                    name: "information_to_release",
                    title: "Information to Release",
                    elements: [
                        {
                            type: "text",
                            name: "date_range_from",
                            title: "Date Range of Records Requested: From",
                            width: "50%",
                            minWidth: "256px",
                        },
                        {
                            type: "text",
                            name: "date_range_to",
                            title: "To",
                            width: "50%",
                            minWidth: "256px",
                            startWithNewLine: false,
                        },
                        {
                            type: "checkbox",
                            name: "information_requested",
                            title: "Please initial next to each type of information requested",
                            choices: [
                                "Summary Letter",
                                "Attendance Record",
                                "Medications List",
                                "Contact Log",
                                "Initial Evaluation",
                                "Treatment Plan",
                                "Progress Notes",
                                "Psychotherapy Notes",
                                "Self-Care Management Plan",
                                "Results of Diagnostic Testing",
                                "Other",
                            ],
                            colCount: 1,
                        },
                        {
                            type: "radiogroup",
                            name: "family_counseling_release",
                            title: "Joint/Family Counseling: Information disclosed may include notes/records from joint/family counseling sessions, if any. Initial one of the following statements:",
                            choices: [
                                "I do authorize release of information from joint/family counseling sessions",
                                "I do not authorize release of information from joint/family counseling sessions",
                            ],
                        },
                        {
                            type: "text",
                            name: "sensitive_information_acknowledgement",
                            title: "Sensitive Information: My initials demonstrate my acknowledgement and authorization to release or disclose this type of information:",
                            width: "100%",
                            minWidth: "256px",
                        },
                        {
                            type: "radiogroup",
                            name: "delivery_instructions",
                            title: "Delivery Instructions",
                            choices: [
                                "Mail",
                                "Fax records directly to person/entity specified above",
                                "Call patient when records are ready for pick up",
                                "Patient/Representative authorizes to pick up the copies",
                                "Other instructions",
                            ],
                        },
                        {
                            type: "text",
                            name: "expiration",
                            title: "Expiration: Without my written revocation, this authorization will automatically expire upon satisfaction of the need for disclosure, or one year from the date signed, unless otherwise specified:",
                            width: "100%",
                            minWidth: "256px",
                        },
                    ],
                },
                {
                    type: "html",
                    name: "notice_of_rights",
                    html: "<h4>Notice of Rights:</h4><ul><li>If I refuse to sign this authorization, my refusal will not affect my ability to obtain treatment.</li><li>I may inspect or obtain a copy of the health information requested in this authorization.</li><li>I may revoke this authorization at any time in writing, signed by me or on my behalf, and delivered to Four Square Clinicals, Medical Records, 100 N Arlington Ave, Suite 340A, Reno, NV 89501.</li><li>If I revoke this authorization, the revocation will not have any effect on any actions taken prior to Four Square Clinicals’ receipt of the revocation.</li><li>I have a right to receive a copy of this authorization.</li><li>Information disclosed pursuant to this authorization could be re-disclosed by the recipient and may no longer be protected by the federal privacy rule (HIPAA). However, Nevada law prohibits the person receiving my health information from making further disclosure of it unless another authorization for such disclosure is obtained from me or unless such disclosure is specifically required or permitted by law.</li></ul>",
                    width: "100%",
                    minWidth: "256px",
                },
                {
                    type: "text",
                    name: "patient_signature",
                    title: "Signature of Patient or Legal Representative",
                    width: "50%",
                    minWidth: "256px",
                },
                {
                    type: "text",
                    name: "patient_signature_date",
                    title: "Date",
                    width: "50%",
                    minWidth: "256px",
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: "relationship",
                    title: "Relationship (if Legal Representative)",
                    width: "50%",
                    minWidth: "256px",
                },
                {
                    type: "text",
                    name: "provider_signature",
                    title: "Signature of Provider",
                    width: "50%",
                    minWidth: "256px",
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: "provider_signature_date",
                    title: "Date",
                    width: "50%",
                    minWidth: "256px",
                },
            ],
        },
        {
            name: "nichq_vanderbilt_assessment_scale_parent",
            title: "NICHQ Vanderbilt Assessment Scale—PARENT Informant",
            elements: [
                {
                    type: "text",
                    name: "date",
                    title: "Today's Date",
                    width: "50%",
                    minWidth: "256px",
                },
                {
                    type: "text",
                    name: "child_name",
                    title: "Child's Name",
                    width: "50%",
                    minWidth: "256px",
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: "child_dob",
                    title: "Date of Birth",
                    inputType: "date",
                    width: "50%",
                    minWidth: "256px",
                },
                {
                    type: "text",
                    name: "parent_name",
                    title: "Parent's Name",
                    width: "50%",
                    minWidth: "256px",
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: "parent_phone",
                    title: "Parent's Phone Number",
                    inputType: "tel",
                    width: "50%",
                    minWidth: "256px",
                },
                {
                    type: "radiogroup",
                    name: "evaluation_basis",
                    title: "Is this evaluation based on a time when the child was on medication?",
                    choices: [
                        "Was on medication",
                        "Was not on medication",
                        "Not sure",
                    ],
                    width: "50%",
                    minWidth: "256px",
                    startWithNewLine: false,
                },
                {
                    type: "matrix",
                    name: "symptoms",
                    title: "Symptoms",
                    columns: [
                        { value: "never", text: "Never" },
                        { value: "occasionally", text: "Occasionally" },
                        { value: "often", text: "Often" },
                        { value: "very_often", text: "Very Often" },
                    ],
                    rows: [
                        {
                            value: "attention_details",
                            text: "Does not pay attention to details or makes careless mistakes with, for example, homework",
                        },
                        {
                            value: "difficulty_attention",
                            text: "Has difficulty keeping attention to what needs to be done",
                        },
                        {
                            value: "does_not_listen",
                            text: "Does not seem to listen when spoken to directly",
                        },
                        {
                            value: "follow_directions",
                            text: "Does not follow through when given directions and fails to finish activities (not due to refusal or failure to understand)",
                        },
                        {
                            value: "organizing_tasks",
                            text: "Has difficulty organizing tasks and activities",
                        },
                        {
                            value: "avoids_tasks",
                            text: "Avoids, dislikes, or does not want to start tasks that require ongoing mental effort",
                        },
                        {
                            value: "loses_things",
                            text: "Loses things necessary for tasks or activities (toys, assignments, pencils, or books)",
                        },
                        {
                            value: "easily_distracted",
                            text: "Is easily distracted by noises or other stimuli",
                        },
                        {
                            value: "forgetful_daily",
                            text: "Is forgetful in daily activities",
                        },
                        {
                            value: "fidgets",
                            text: "Fidgets with hands or feet or squirms in seat",
                        },
                        {
                            value: "leaves_seat",
                            text: "Leaves seat when remaining seated is expected",
                        },
                        {
                            value: "runs_climbs",
                            text: "Runs about or climbs too much when remaining seated is expected",
                        },
                        {
                            value: "difficulty_playing",
                            text: "Has difficulty playing or beginning quiet play activities",
                        },
                        {
                            value: "on_the_go",
                            text: "Is “on the go” or often acts as if “driven by a motor”",
                        },
                        { value: "talks_too_much", text: "Talks too much" },
                        {
                            value: "blurts_out",
                            text: "Blurts out answers before questions have been completed",
                        },
                        {
                            value: "difficulty_waiting",
                            text: "Has difficulty waiting his or her turn",
                        },
                        {
                            value: "interrupts_intrudes",
                            text: "Interrupts or intrudes in on others’ conversations and/or activities",
                        },
                        { value: "argues_adults", text: "Argues with adults" },
                        { value: "loses_temper", text: "Loses temper" },
                        {
                            value: "defies_refuses",
                            text: "Actively defies or refuses to go along with adults’ requests or rules",
                        },
                        {
                            value: "deliberately_annoys",
                            text: "Deliberately annoys people",
                        },
                        {
                            value: "blames_others",
                            text: "Blames others for his or her mistakes or misbehaviors",
                        },
                        {
                            value: "touchy_easily_annoyed",
                            text: "Is touchy or easily annoyed by others",
                        },
                        {
                            value: "angry_resentful",
                            text: "Is angry or resentful",
                        },
                        {
                            value: "spiteful_get_even",
                            text: "Is spiteful and wants to get even",
                        },
                        {
                            value: "bullies_threatens",
                            text: "Bullies, threatens, or intimidates others",
                        },
                        {
                            value: "starts_fights",
                            text: "Starts physical fights",
                        },
                        {
                            value: "lies_to_get_out",
                            text: "Lies to get out of trouble or to avoid obligations (ie, “cons” others)",
                        },
                        {
                            value: "truant_school",
                            text: "Is truant from school (skips school) without permission",
                        },
                        {
                            value: "physically_cruel_people",
                            text: "Is physically cruel to people",
                        },
                        {
                            value: "stolen_things_value",
                            text: "Has stolen things that have value",
                        },
                        {
                            value: "deliberately_destroys_property",
                            text: "Deliberately destroys others’ property",
                        },
                        {
                            value: "used_weapon",
                            text: "Has used a weapon that can cause serious harm (bat, knife, brick, gun)",
                        },
                        {
                            value: "physically_cruel_animals",
                            text: "Is physically cruel to animals",
                        },
                        {
                            value: "set_fires",
                            text: "Has deliberately set fires to cause damage",
                        },
                        {
                            value: "broken_into",
                            text: "Has broken into someone else’s home, business, or car",
                        },
                        {
                            value: "stayed_out_night",
                            text: "Has stayed out at night without permission",
                        },
                        {
                            value: "run_away",
                            text: "Has run away from home overnight",
                        },
                        {
                            value: "forced_sexual_activity",
                            text: "Has forced someone into sexual activity",
                        },
                        {
                            value: "fearful_anxious",
                            text: "Is fearful, anxious, or worried",
                        },
                        {
                            value: "afraid_try_new_things",
                            text: "Is afraid to try new things for fear of making mistakes",
                        },
                        {
                            value: "feels_worthless_inferior",
                            text: "Feels worthless or inferior",
                        },
                        {
                            value: "blames_self",
                            text: "Blames self for problems, feels guilty",
                        },
                        {
                            value: "feels_lonely",
                            text: "Feels lonely, unwanted, or unloved; complains that “no one loves him or her”",
                        },
                        {
                            value: "sad_unhappy",
                            text: "Is sad, unhappy, or depressed",
                        },
                        {
                            value: "self_conscious",
                            text: "Is self-conscious or easily embarrassed",
                        },
                    ],
                },
                {
                    type: "matrix",
                    name: "performance",
                    title: "Performance",
                    columns: [
                        { value: "excellent", text: "Excellent" },
                        {
                            value: "above_average",
                            text: "Somewhat Above Average",
                        },
                        { value: "average", text: "Average" },
                        { value: "problem", text: "Problem" },
                        { value: "problematic", text: "Problematic" },
                    ],
                    rows: [
                        {
                            value: "overall_school_performance",
                            text: "Overall school performance",
                        },
                        { value: "reading", text: "Reading" },
                        { value: "writing", text: "Writing" },
                        { value: "mathematics", text: "Mathematics" },
                        {
                            value: "relationship_with_parents",
                            text: "Relationship with parents",
                        },
                        {
                            value: "relationship_with_siblings",
                            text: "Relationship with siblings",
                        },
                        {
                            value: "relationship_with_peers",
                            text: "Relationship with peers",
                        },
                        {
                            value: "participation_organized_activities",
                            text: "Participation in organized activities (eg, teams)",
                        },
                    ],
                },
                {
                    type: "comment",
                    name: "parent_comments",
                    title: "Comments",
                    width: "100%",
                    minWidth: "256px",
                },
            ],
        },
        {
            name: "nichq_vanderbilt_assessment_scale_teacher",
            title: "NICHQ Vanderbilt Assessment Scale—TEACHER Informant",
            elements: [
                {
                    type: "text",
                    name: "teacher_name",
                    title: "Teacher's Name",
                    width: "50%",
                    minWidth: "256px",
                },
                {
                    type: "text",
                    name: "class_time",
                    title: "Class Time",
                    width: "50%",
                    minWidth: "256px",
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: "class_name_period",
                    title: "Class Name/Period",
                    width: "50%",
                    minWidth: "256px",
                },
                {
                    type: "text",
                    name: "date",
                    title: "Today's Date",
                    inputType: "date",
                    width: "50%",
                    minWidth: "256px",
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: "child_name",
                    title: "Child's Name",
                    width: "50%",
                    minWidth: "256px",
                },
                {
                    type: "text",
                    name: "grade_level",
                    title: "Grade Level",
                    width: "50%",
                    minWidth: "256px",
                    startWithNewLine: false,
                },
                {
                    type: "text",
                    name: "evaluation_period",
                    title: "Please indicate the number of weeks or months you have been able to evaluate the behaviors",
                    width: "50%",
                    minWidth: "256px",
                },
                {
                    type: "radiogroup",
                    name: "evaluation_basis",
                    title: "Is this evaluation based on a time when the child was on medication?",
                    choices: [
                        "Was on medication",
                        "Was not on medication",
                        "Not sure",
                    ],
                    width: "50%",
                    minWidth: "256px",
                    startWithNewLine: false,
                },
                {
                    type: "matrix",
                    name: "symptoms",
                    title: "Symptoms",
                    columns: [
                        { value: "never", text: "Never" },
                        { value: "occasionally", text: "Occasionally" },
                        { value: "often", text: "Often" },
                        { value: "very_often", text: "Very Often" },
                    ],
                    rows: [
                        {
                            value: "attention_details",
                            text: "Fails to give attention to details or makes careless mistakes in schoolwork",
                        },
                        {
                            value: "difficulty_attention",
                            text: "Has difficulty sustaining attention to tasks or activities",
                        },
                        {
                            value: "does_not_listen",
                            text: "Does not seem to listen when spoken to directly",
                        },
                        {
                            value: "follow_directions",
                            text: "Does not follow through on instructions and fails to finish schoolwork (not due to oppositional behavior or failure to understand)",
                        },
                        {
                            value: "organizing_tasks",
                            text: "Has difficulty organizing tasks and activities",
                        },
                        {
                            value: "avoids_tasks",
                            text: "Avoids, dislikes, or is reluctant to engage in tasks that require sustained mental effort",
                        },
                        {
                            value: "loses_things",
                            text: "Loses things necessary for tasks or activities (school assignments, pencils, or books)",
                        },
                        {
                            value: "easily_distracted",
                            text: "Is easily distracted by extraneous stimuli",
                        },
                        {
                            value: "forgetful_daily",
                            text: "Is forgetful in daily activities",
                        },
                        {
                            value: "fidgets",
                            text: "Fidgets with hands or feet or squirms in seat",
                        },
                        {
                            value: "leaves_seat",
                            text: "Leaves seat in classroom or in other situations in which remaining seated is expected",
                        },
                        {
                            value: "runs_climbs",
                            text: "Runs about or climbs excessively in situations in which remaining seated is expected",
                        },
                        {
                            value: "difficulty_playing",
                            text: "Has difficulty playing or engaging in leisure activities quietly",
                        },
                        {
                            value: "on_the_go",
                            text: "Is “on the go” or often acts as if “driven by a motor”",
                        },
                        { value: "talks_too_much", text: "Talks excessively" },
                        {
                            value: "blurts_out",
                            text: "Blurts out answers before questions have been completed",
                        },
                        {
                            value: "difficulty_waiting",
                            text: "Has difficulty waiting in line",
                        },
                        {
                            value: "interrupts_intrudes",
                            text: "Interrupts or intrudes on others (eg, butts into conversations/games)",
                        },
                        { value: "loses_temper", text: "Loses temper" },
                        {
                            value: "defies_refuses",
                            text: "Actively defies or refuses to comply with adult’s requests or rules",
                        },
                        {
                            value: "angry_resentful",
                            text: "Is angry or resentful",
                        },
                        {
                            value: "spiteful_vindictive",
                            text: "Is spiteful and vindictive",
                        },
                        {
                            value: "bullies_threatens",
                            text: "Bullies, threatens, or intimidates others",
                        },
                        {
                            value: "starts_fights",
                            text: "Initiates physical fights",
                        },
                        {
                            value: "lies_to_get_out",
                            text: "Lies to obtain goods for favors or to avoid obligations (eg, “cons” others)",
                        },
                        {
                            value: "physically_cruel_people",
                            text: "Is physically cruel to people",
                        },
                        {
                            value: "stolen_things_value",
                            text: "Has stolen items of nontrivial value",
                        },
                        {
                            value: "deliberately_destroys_property",
                            text: "Deliberately destroys others’ property",
                        },
                        {
                            value: "fearful_anxious",
                            text: "Is fearful, anxious, or worried",
                        },
                        {
                            value: "afraid_try_new_things",
                            text: "Is afraid to try new things for fear of making mistakes",
                        },
                        {
                            value: "feels_worthless_inferior",
                            text: "Feels worthless or inferior",
                        },
                        {
                            value: "blames_self",
                            text: "Blames self for problems; feels guilty",
                        },
                        {
                            value: "feels_lonely",
                            text: "Feels lonely, unwanted, or unloved; complains that “no one loves him or her”",
                        },
                        {
                            value: "sad_unhappy",
                            text: "Is sad, unhappy, or depressed",
                        },
                        {
                            value: "self_conscious",
                            text: "Is self-conscious or easily embarrassed",
                        },
                    ],
                },
                {
                    type: "matrix",
                    name: "performance",
                    title: "Performance",
                    columns: [
                        { value: "excellent", text: "Excellent" },
                        {
                            value: "above_average",
                            text: "Somewhat Above Average",
                        },
                        { value: "average", text: "Average" },
                        { value: "problem", text: "Problem" },
                        { value: "problematic", text: "Problematic" },
                    ],
                    rows: [
                        {
                            value: "overall_academic_performance",
                            text: "Overall academic performance",
                        },
                        { value: "reading", text: "Reading" },
                        { value: "writing", text: "Writing" },
                        { value: "mathematics", text: "Mathematics" },
                        {
                            value: "relationship_with_peers",
                            text: "Relationship with peers",
                        },
                        {
                            value: "following_directions",
                            text: "Following directions/rules",
                        },
                        {
                            value: "classroom_behavior",
                            text: "Classroom behavior",
                        },
                        {
                            value: "working_with_adults",
                            text: "Working with adults",
                        },
                    ],
                },
                {
                    type: "comment",
                    name: "teacher_comments",
                    title: "Comments",
                    width: "100%",
                    minWidth: "256px",
                },
            ],
        },
        {
            name: "anxiety_assessment",
            title: "Generalized Anxiety Disorder (GAD-7) Assessment",
            elements: [
                {
                    type: "matrix",
                    name: "gad7_questions",
                    title: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
                    columns: [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day",
                    ],
                    rows: [
                        "Feeling nervous, anxious, or on edge",
                        "Not being able to stop or control worrying",
                        "Worrying too much about different things",
                        "Trouble relaxing",
                        "Being so restless that it's hard to sit still",
                        "Becoming easily annoyed or irritable",
                        "Feeling afraid as if something awful might happen",
                    ],
                },
            ],
        },
        {
            name: "phq9_assessment",
            title: "Patient Health Questionnaire (PHQ-9)",
            elements: [
                {
                    type: "matrix",
                    name: "phq9_questions",
                    title: "Over the last 2 weeks, how often have you been bothered by any of the following problems?",
                    columns: [
                        "Not at all",
                        "Several days",
                        "More than half the days",
                        "Nearly every day",
                    ],
                    rows: [
                        "Little interest or pleasure in doing things",
                        "Feeling down, depressed, or hopeless",
                        "Trouble falling or staying asleep, or sleeping too much",
                        "Feeling tired or having little energy",
                        "Poor appetite or overeating",
                        "Feeling bad about yourself – or that you are a failure or have let yourself or your family down",
                        "Trouble concentrating on things, such as reading the newspaper or watching television",
                        "Moving or speaking so slowly that other people could have noticed? Or the opposite – being so fidgety or restless that you have been moving around a lot more than usual",
                        "Thoughts that you would be better off dead or of hurting yourself in some way",
                    ],
                },
                {
                    type: "radiogroup",
                    name: "phq9_difficulty",
                    title: "If you checked off any problems, how difficult have these problems made it for you to do your work, take care of things at home, or get along with other people?",
                    choices: [
                        "Not difficult at all",
                        "Somewhat difficult",
                        "Very difficult",
                        "Extremely difficult",
                    ],
                },
            ],
        },
        {
            name: "other_assessments",
            title: "Other Assessments",
            elements: [
                {
                    type: "panel",
                    name: "ocd_assessment",
                    title: "OCD Assessment",
                    elements: [
                        {
                            type: "matrix",
                            name: "ocd_questions",
                            title: "Please answer the following questions:",
                            columns: ["Yes", "No"],
                            rows: [
                                "Do you have any tendency to keep things extremely clean or wash your hands very frequently, more than other people you know?",
                                "Do you check things over and over to excess?",
                                "Do you have to straighten, order, or tidy things so much that it interferes with other things you want to do?",
                                "Do you worry excessively about acting or speaking more aggressively then you should?",
                                "Do you have great difficulty discarding things even when they have no practical value?",
                            ],
                        },
                        {
                            type: "matrix",
                            name: "ocd_duration",
                            title: "Please indicate the duration of the following:",
                            columns: [
                                "None",
                                "< 1 hr/day",
                                "1-3 hr/day",
                                "3-8 hr/day",
                                "> 8 hr/day",
                            ],
                            rows: [
                                "How much of your time is occupied by obsessive thoughts?",
                                "How much time do you spend performing compulsive behaviors?",
                            ],
                        },
                        {
                            type: "matrix",
                            name: "ocd_interference",
                            title: "How much do these issues interfere with your daily life?",
                            columns: [
                                "None",
                                "Slightly",
                                "Definitely, but manageable",
                                "Substantially",
                                "Extremely",
                            ],
                            rows: [
                                "How much do your obsessive thoughts interfere with functioning in your social, work or other roles?",
                                "How much do your compulsive behaviors interfere with functioning in your social, work or other roles?",
                            ],
                        },
                    ],
                },
                {
                    type: "panel",
                    name: "mood_disorder_assessment",
                    title: "Mood Disorder Assessment",
                    elements: [
                        {
                            type: "matrix",
                            name: "mood_disorder_questions",
                            title: "Please answer the following questions:",
                            columns: ["Yes", "No"],
                            rows: [
                                "Have any of your blood relatives been diagnosed as 'Manic-Depressive' or as having Bipolar Disorder?",
                                "Have you ever had far more energy than usual, slept very little, and engaged in activities that may have been risky or dangerous?",
                                "Has there ever been a period of time when you were not your usual self and you felt so good or hyper that other people thought you were not your normal self, or you were so hyper that you got into trouble?",
                                "You were so irritable that you shouted at people or started fights or arguments?",
                                "You felt much more self-confident than usual?",
                                "You were much more talkative or spoke much faster than usual?",
                                "You got much less sleep than usual and found you didn't really miss it?",
                                "Thoughts raced through your head or you couldn't slow your mind down?",
                                "You were so easily distracted by things around you that you had trouble concentrating or staying on track?",
                                "You had much more energy than usual?",
                                "You were much more active or did many more things than usual?",
                                "You were much more social or outgoing than usual - for example, you telephoned friends in the middle of the night?",
                                "You were much more interested in sex than usual?",
                                "You did things that were unusual for you or that other people might have thought were excessive, foolish or risky?",
                                "You spent so much money that it got you or your family into trouble?",
                            ],
                        },
                    ],
                },
            ],
        },
        {
            name: "medications",
            title: "Medications",
            elements: [
                {
                    type: "panel",
                    name: "current_medications",
                    title: "Current Medications",
                    elements: [
                        {
                            type: "boolean",
                            name: "taking_medications",
                            title: "Are you currently taking any medications?",
                            width: "50%",
                        },
                        {
                            type: "text",
                            name: "primary_prescriber",
                            title: "Name of your primary prescriber (if applicable)",
                            visibleIf: "{taking_medications} = true",
                            width: "100%",
                        },
                        {
                            type: "matrixdynamic",
                            name: "medication_list",
                            title: "Current Medications",
                            visibleIf: "{taking_medications} = true",
                            columns: [
                                {
                                    name: "medication",
                                    title: "Medication",
                                    cellType: "dropdown",
                                    choicesOrder: "random",
                                    choices: [
                                        "Select medication...",
                                        "Prozac (Fluoxetine)",
                                        "Zoloft (Sertraline)",
                                        "Lexapro (Escitalopram)",
                                        "Paxil (Paroxetine)",
                                        "Celexa (Citalopram)",
                                        "Wellbutrin (Bupropion)",
                                        "Effexor (Venlafaxine)",
                                        "Cymbalta (Duloxetine)",
                                        "Pristiq (Desvenlafaxine)",
                                        "Remeron (Mirtazapine)",
                                        "Xanax (Alprazolam)",
                                        "Ativan (Lorazepam)",
                                        "Klonopin (Clonazepam)",
                                        "Valium (Diazepam)",
                                        "Buspar (Buspirone)",
                                        "Adderall (Amphetamine/Dextroamphetamine)",
                                        "Ritalin (Methylphenidate)",
                                        "Concerta (Methylphenidate ER)",
                                        "Vyvanse (Lisdexamfetamine)",
                                        "Strattera (Atomoxetine)",
                                        "Abilify (Aripiprazole)",
                                        "Seroquel (Quetiapine)",
                                        "Risperdal (Risperidone)",
                                        "Zyprexa (Olanzapine)",
                                        "Geodon (Ziprasidone)",
                                        "Lithium",
                                        "Depakote (Valproic Acid)",
                                        "Lamictal (Lamotrigine)",
                                        "Tegretol (Carbamazepine)",
                                        "Ambien (Zolpidem)",
                                        "Lunesta (Eszopiclone)",
                                        "Trazodone",
                                        "Other (please specify)",
                                    ],
                                },
                                {
                                    name: "other_medication",
                                    title: "If Other, please specify",
                                    cellType: "text",
                                    visibleIf:
                                        "{row.medication} == 'Other (please specify)'",
                                },
                                {
                                    name: "dosage",
                                    title: "Dosage",
                                    cellType: "text",
                                },
                                {
                                    name: "frequency",
                                    title: "Frequency",
                                    cellType: "dropdown",
                                    choices: [
                                        "Once daily",
                                        "Twice daily",
                                        "Three times daily",
                                        "Four times daily",
                                        "Every other day",
                                        "Weekly",
                                        "As needed",
                                        "Other (please specify)",
                                    ],
                                },
                                {
                                    name: "reason",
                                    title: "Reason",
                                    cellType: "dropdown",
                                    choicesOrder: "random",
                                    choices: [
                                        "Select reason...",
                                        "Depression",
                                        "Anxiety",
                                        "Bipolar Disorder",
                                        "Schizophrenia",
                                        "ADHD",
                                        "Insomnia",
                                        "OCD",
                                        "PTSD",
                                        "Panic Disorder",
                                        "Social Anxiety",
                                        "Generalized Anxiety Disorder",
                                        "Eating Disorder",
                                        "Substance Use Disorder",
                                        "Pain Management",
                                        "Other (please specify)",
                                    ],
                                },
                                {
                                    name: "other_reason",
                                    title: "If Other, please specify",
                                    cellType: "text",
                                    visibleIf:
                                        "{row.reason} == 'Other (please specify)'",
                                },
                                {
                                    name: "prescriber",
                                    title: "Prescriber",
                                    cellType: "dropdown",
                                    choices: [
                                        "Select prescriber...",
                                        "Primary Care Physician",
                                        "Psychiatrist",
                                        "Nurse Practitioner",
                                        "Same as primary prescriber listed above",
                                        "Other (please specify)",
                                    ],
                                },
                                {
                                    name: "other_prescriber",
                                    title: "If Other, please specify",
                                    cellType: "text",
                                    visibleIf:
                                        "{row.prescriber} == 'Other (please specify)'",
                                },
                            ],
                            addRowText: "Add Medication",
                            removeRowText: "Remove Medication",
                        },
                    ],
                },
                {
                    type: "panel",
                    name: "past_medications",
                    title: "Past Medications",
                    elements: [
                        {
                            type: "matrixdynamic",
                            name: "past_medication_list",
                            title: "Past Medications (if applicable)",
                            columns: [
                                {
                                    name: "medication",
                                    title: "Medication",
                                    cellType: "dropdown",
                                    choicesOrder: "random",
                                    choices: [
                                        "Select medication...",
                                        "Prozac (Fluoxetine)",
                                        "Zoloft (Sertraline)",
                                        "Lexapro (Escitalopram)",
                                        "Paxil (Paroxetine)",
                                        "Celexa (Citalopram)",
                                        "Wellbutrin (Bupropion)",
                                        "Effexor (Venlafaxine)",
                                        "Cymbalta (Duloxetine)",
                                        "Pristiq (Desvenlafaxine)",
                                        "Remeron (Mirtazapine)",
                                        "Xanax (Alprazolam)",
                                        "Ativan (Lorazepam)",
                                        "Klonopin (Clonazepam)",
                                        "Valium (Diazepam)",
                                        "Buspar (Buspirone)",
                                        "Adderall (Amphetamine/Dextroamphetamine)",
                                        "Ritalin (Methylphenidate)",
                                        "Concerta (Methylphenidate ER)",
                                        "Vyvanse (Lisdexamfetamine)",
                                        "Strattera (Atomoxetine)",
                                        "Abilify (Aripiprazole)",
                                        "Seroquel (Quetiapine)",
                                        "Risperdal (Risperidone)",
                                        "Zyprexa (Olanzapine)",
                                        "Geodon (Ziprasidone)",
                                        "Lithium",
                                        "Depakote (Valproic Acid)",
                                        "Lamictal (Lamotrigine)",
                                        "Tegretol (Carbamazepine)",
                                        "Ambien (Zolpidem)",
                                        "Lunesta (Eszopiclone)",
                                        "Trazodone",
                                        "Other (please specify)",
                                    ],
                                },
                                {
                                    name: "other_medication",
                                    title: "If Other, please specify",
                                    cellType: "text",
                                    visibleIf:
                                        "{row.medication} == 'Other (please specify)'",
                                },
                                {
                                    name: "reason",
                                    title: "Reason",
                                    cellType: "dropdown",
                                    choicesOrder: "random",
                                    choices: [
                                        "Select reason...",
                                        "Depression",
                                        "Anxiety",
                                        "Bipolar Disorder",
                                        "Schizophrenia",
                                        "ADHD",
                                        "Insomnia",
                                        "OCD",
                                        "PTSD",
                                        "Panic Disorder",
                                        "Social Anxiety",
                                        "Generalized Anxiety Disorder",
                                        "Eating Disorder",
                                        "Substance Use Disorder",
                                        "Pain Management",
                                        "Other (please specify)",
                                    ],
                                },
                                {
                                    name: "other_reason",
                                    title: "If Other, please specify",
                                    cellType: "text",
                                    visibleIf:
                                        "{row.reason} == 'Other (please specify)'",
                                },
                                {
                                    name: "reason_for_stopping",
                                    title: "Reason for Stopping",
                                    cellType: "dropdown",
                                    choices: [
                                        "Select reason...",
                                        "Ineffective",
                                        "Side effects",
                                        "No longer needed",
                                        "Cost",
                                        "Doctor's recommendation",
                                        "Other (please specify)",
                                    ],
                                },
                                {
                                    name: "other_reason_for_stopping",
                                    title: "If Other, please specify",
                                    cellType: "text",
                                    visibleIf:
                                        "{row.reason_for_stopping} == 'Other (please specify)'",
                                },
                            ],
                            addRowText: "Add Past Medication",
                            removeRowText: "Remove Medication",
                        },
                    ],
                },
            ],
        },
        {
            name: "consents_and_agreements",
            title: "Consents and Agreements",
            elements: [
                {
                    type: "panel",
                    name: "treatment_consent",
                    title: "Consent for Treatment",
                    elements: [
                        {
                            type: "html",
                            name: "treatment_consent_text",
                            html: "<p>I authorize and request my practitioner to carry out psychological examinations, treatments, and/or diagnostic procedures which now or during the course of my treatment become advisable. I understand the purpose of these procedures will be explained to me upon my request and that they are subject to my agreement. I also understand that while the course of my treatment is designed to be helpful, my practitioner can make no guarantees about the outcome of my treatment.</p>",
                        },
                        {
                            type: "boolean",
                            name: "treatment_consent_agreement",
                            title: "I have read and understand the above, and I agree to these terms",
                            //isRequired: true,
                        },
                        {
                            type: "signaturepad",
                            name: "treatment_consent_signature",
                            title: "Patient Signature",
                            width: "100%",
                            //isRequired: true,
                        },
                    ],
                },
                {
                    type: "panel",
                    name: "telehealth_consent",
                    title: "Informed Consent for Telehealth",
                    elements: [
                        {
                            type: "html",
                            name: "telehealth_consent_text",
                            html: "<p>This Informed Consent for Telehealth contains important information focusing on doing psychotherapy using the phone or the Internet. Please read this carefully and let us know if you have any questions.</p><p><strong>Benefits and Risks of Telehealth:</strong> Telehealth provides increased access to mental health services and flexibility in scheduling. However, it may lack some visual or audio cues used in traditional in-person sessions and may not be suitable for all mental health conditions.</p><p><strong>Confidentiality:</strong> The laws that protect the confidentiality of your medical information also apply to telehealth. However, there are both mandatory and permissive exceptions to confidentiality, which are described in the general Consent Form.</p><p><strong>Emergencies and Technology:</strong> Assessing and evaluating threats and other emergencies can be more difficult when conducting telehealth compared to traditional in-person therapy. If an emergency situation arises, please call 911 or go to your nearest emergency room.</p>",
                        },
                        {
                            type: "boolean",
                            name: "telehealth_consent_agreement",
                            title: "I have read and understand the above, and I agree to these terms for telehealth sessions",
                            //isRequired: true,
                        },
                        {
                            type: "signaturepad",
                            name: "telehealth_consent_signature",
                            title: "Patient Signature",
                            width: "100%",
                            //isRequired: true,
                        },
                    ],
                },
                {
                    type: "panel",
                    name: "privacy_notice",
                    title: "Acknowledgement of Notice of Privacy Practices",
                    elements: [
                        {
                            type: "html",
                            name: "privacy_notice_text",
                            html: "<p>I acknowledge that I have received the Notice of Privacy Practices, which describes how health information about me may be used and disclosed by this practice.</p>",
                        },
                        {
                            type: "boolean",
                            name: "privacy_notice_agreement",
                            title: "I acknowledge that I have received and reviewed the Notice of Privacy Practices",
                            //isRequired: true,
                        },
                        {
                            type: "signaturepad",
                            name: "privacy_notice_signature",
                            title: "Patient Signature",
                            width: "100%",
                            //isRequired: true,
                        },
                    ],
                },
                {
                    type: "panel",
                    name: "financial_agreement",
                    title: "Financial Agreement",
                    elements: [
                        {
                            type: "html",
                            name: "financial_agreement_text",
                            html: "<p>I understand that I am responsible for all charges not covered by insurance, including deductibles, co-payments, and non-covered services. I agree to pay these charges at the time of service unless other arrangements have been made.</p>",
                        },
                        {
                            type: "boolean",
                            name: "financial_agreement_acceptance",
                            title: "I have read and agree to the financial terms described above",
                            //isRequired: true,
                        },
                        {
                            type: "signaturepad",
                            name: "financial_agreement_signature",
                            title: "Patient Signature",
                            width: "100%",
                            //isRequired: true,
                        },
                    ],
                },
                {
                    type: "panel",
                    name: "medication_consent",
                    title: "Medication Consent",
                    elements: [
                        {
                            type: "html",
                            name: "medication_consent_text",
                            html: "<p>I certify/consent that I am willing to be tapered off controlled substances. I understand that I will NOT receive a refill for my controlled substance and will work with my medical team to gradually taper off the controlled substance. In the event that I do not wish to be tapered off from my controlled substance, I understand I would be discharged from the practice and will need to find another provider in my network.</p>",
                        },
                        {
                            type: "boolean",
                            name: "medication_consent_agreement",
                            title: "I have read and agree to the medication terms described above",
                            //isRequired: true,
                        },
                        {
                            type: "signaturepad",
                            name: "medication_consent_signature",
                            title: "Patient Signature",
                            width: "100%",
                            //isRequired: true,
                        },
                    ],
                },
                {
                    type: "panel",
                    name: "patient-rights-acknowledgement",
                    title: "FOUR SQUARE CLINICALS PATIENT RIGHTS ACKNOWLEDGEMENT",
                    elements: [
                        {
                            type: "html",
                            name: "acknowledgement-intro",
                            html: "<p>By signing this form, I acknowledge understanding and receipt of the following information was given to me during the intake process:</p>",
                        },
                        {
                            type: "checkbox",
                            name: "rights-acknowledgement",
                            title: "I acknowledge receipt and understanding of:",
                            isRequired: true,
                            choices: [
                                {
                                    value: "rights",
                                    text: "1. My rights and responsibilities",
                                },
                                {
                                    value: "opinion",
                                    text: "2. How to give my opinion about:",
                                },
                                { value: "goals", text: "a. Goals achieved" },
                                {
                                    value: "satisfaction",
                                    text: "b. Level of satisfaction",
                                },
                                {
                                    value: "expectations",
                                    text: "3. What is expected of me",
                                },
                                {
                                    value: "hours",
                                    text: "4. Hours the Behavioral Program is open for services",
                                },
                                {
                                    value: "after-hours",
                                    text: "5. How to receive assistance after hours, especially if it's an emergency",
                                },
                                {
                                    value: "code-of-conduct",
                                    text: "6. A summary of the Professional Code of Conduct of the Organization",
                                },
                                {
                                    value: "confidentiality",
                                    text: "7. Information of how my information is kept confidential",
                                },
                                {
                                    value: "confidentiality-limits",
                                    text: "8. Information about the limits of confidentiality and how to file grievance",
                                },
                                {
                                    value: "coordinator",
                                    text: "9. I have met the person that will be coordinating my services",
                                },
                                {
                                    value: "treatment-planning",
                                    text: "10. How I will participate in my treatment planning",
                                },
                            ],
                        },
                        {
                            type: "signaturepad",
                            name: "patient-signature",
                            title: "Patient Signature",
                            isRequired: true,
                        },
                        {
                            type: "text",
                            name: "patient-name",
                            title: "Patient Name (printed)",
                            isRequired: true,
                        },
                        {
                            type: "text",
                            name: "date",
                            title: "Date",
                            inputType: "date",
                            isRequired: true,
                        },
                    ],
                    width: "100%",
                    minWidth: "256px",
                },
            ],
        },
        {
            type: "panel",
            name: "crisis-hotlines",
            title: "Crisis Hotlines and Support Services",
            elements: [
                {
                    type: "html",
                    name: "local-24-hour",
                    html: "<h3>Local 24 Hour Access and Crisis Lines</h3>",
                },
                {
                    type: "html",
                    name: "national-suicide-prevention",
                    html: `<h4>National Suicide Prevention Life Line</h4>
                       <p>Call 1-800-273-8255</p>
                       <p>The Lifeline provides 24/7, free and confidential support for people in distress, prevention and crisis resources for you or your loved ones, and best practices for professionals.</p>`,
                },
                {
                    type: "html",
                    name: "spanish-lifeline",
                    html: `<h4>Ayuda En Español (Spanish National Suicide Prevention Lifeline)</h4>
                       <p>Cuando usted llama al número 1-888-628-9454, su llamada se dirige al centro de ayuda de nuestra red disponible más cercano. Cuando el centro contesta su llamada, usted estará hablando con una persona que le escuchará, le hará preguntas y hará todo lo que esté a su alcance para ayudarle.</p>`,
                },
                {
                    type: "html",
                    name: "crisis-text-line",
                    html: `<h4>Crisis Text Line</h4>
                       <p>Crisis Text Line is free, 24/7 support for those in crisis. Text HOME to 741741 from anywhere in the US to text with a trained Crisis Counselor.</p>`,
                },
                {
                    type: "html",
                    name: "crisis-support-nevada",
                    html: `<h4>Crisis Support Services of Nevada</h4>
                       <p>775-784-8090</p>
                       <p>Crisis Support Services of Nevada is a 24/7 number where skilled counselors can assist you.</p>`,
                },
                {
                    type: "html",
                    name: "mobile-outreach-safety",
                    html: `<h4>Mobile Outreach Safety Team (18 yrs and older)</h4>
                       <p>Washoe County (775) 334-2677</p>`,
                },
                {
                    type: "html",
                    name: "trevor-project",
                    html: `<h4>Trevor Project</h4>
                       <p>Call 1-866-488-7386 or Text "Trevor" to 1-202-304-1200 M- F, 12 noon - 7 PM PST (Standard text messaging rates apply.)</p>
                       <p>The Trevor Project is the leading national organization providing crisis intervention and suicide prevention services to lesbian, gay, bisexual, transgender, queer & questioning (LGBTQ) young people under 25.</p>`,
                },
                {
                    type: "html",
                    name: "childrens-mobile-crisis",
                    html: `<h4>Children's Mobile Crisis Response Team (18 years and younger)</h4>
                       <p>Southern NV--702-486-7865; Monday - Sunday, 24 hours</p>
                       <p>Northern NV--775-688-4970; Monday - Friday, 8 AM to 8 PM; Saturday - Sunday, 8 AM - 6PM</p>
                       <p>Rural NV--702-486-7865; Monday - Sunday, 9 AM - 6 PM</p>`,
                },
                {
                    type: "html",
                    name: "national-24-hour",
                    html: `<h4>National 24 Hours Access and Crisis Lines</h4>
                       <ul>
                         <li>Family Crisis: 866-233-4357</li>
                         <li>Suicide Crisis: 800-273-8255</li>
                         <li>Teen Crisis: 866-331-9474</li>
                         <li>Teen Crisis Hotline: 800-852-8336</li>
                         <li>Substance Abuse: 877-548-2072</li>
                       </ul>`,
                },
            ],
            width: "100%",
            minWidth: "256px",
        },
    ],
    calculatedValues: [
        {
            name: "gad7_score",
            expression:
                "{gad7_questions[0]} + {gad7_questions[1]} + {gad7_questions[2]} + {gad7_questions[3]} + {gad7_questions[4]} + {gad7_questions[5]} + {gad7_questions[6]}",
        },
        {
            name: "phq9_score",
            expression:
                "{phq9_questions[0]} + {phq9_questions[1]} + {phq9_questions[2]} + {phq9_questions[3]} + {phq9_questions[4]} + {phq9_questions[5]} + {phq9_questions[6]} + {phq9_questions[7]} + {phq9_questions[8]}",
        },
        {
            name: "ocd_duration_score",
            expression: "{ocd_duration[0]} + {ocd_duration[1]}",
        },
        {
            name: "ocd_interference_score",
            expression: "{ocd_interference[0]} + {ocd_interference[1]}",
        },
    ],
    showQuestionNumbers: "off",
    showProgressBar: "bottom",
    showNavigationButtons: true,
    showCompletedPage: true,
    completeText: "Submit Registration",
    widthMode: "static",
    showTOC: true,
    showPreviewBeforeComplete: "showAllQuestions",
};
