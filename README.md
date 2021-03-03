[![Build Status](https://travis-ci.com/MrSRK/pesrk.svg?branch=main)](https://travis-ci.com/MrSRK/pesrk)

# Σκοπός 

Είναι η δημιουργία μιας δικτυακής εφαρμογής για η οποία θα παρουσιάζει στους επισκέπτες της προϊόντα (προσφορά ή ζήτηση) που άλλοι εγγεγραμμένοι χρήστες έχουν αναρτήσει. 

## Οντότητες 
* Administrators
* User (State: Quest / Involve)
* Products (State: Offer / Demand)
* Categories
* Reviews
* Messages

## Επισκέπτης 
	
Κάθε επισκέπτης θα μπορεί να περιηγηθεί μέσα από δύο κεντρικά μενού (προσφορά και ζήτηση) σε ένα σύνολο κατηγοριών προϊόντων  και να δει πληροφορίες για τα προβαλλόμενα προϊόντα και τους χρήστες που να έχουν ανάρτηση (με υποθετικό σκοπό την αγορά). Θα μπορεί υπό συνθήκες να υποβάλει ερωτήματα προς τον χρήστη που έχει κάνει την ανάρτηση και να γράψει υπό συνθήκες την κριτική του για αυτά.

## Χρήστης

Κάθε χρήστης μπορεί να κάνει εκτός από ότι μπορεί να κάνει και ένας επισκέπτης αλλά και να αναρτήσει προϊόντα  (ζήτηση ή προσφορά) να κάνει αίτηση στον διαχειριστή για άνοιγμα νέας κατηγορίας ή υποκατηγορίας και να παρακολουθεί τόσο τις αναρτήσεις του (επισκεψιμότητα, σχόλια ή βαθμολογία) αλλά και να απαντήσει σε ερωτήματα που του έχουν θέσει άλλοι επισκέπτες ή χρήστες για τα προϊόντα που έχει αναρτήσει.

## Διαχειριστής 

Ο διαχειριστής έχει την γενικότερη επιμέλεια του προβαλλόμενου περιεχομένου και την δυνατότητα να αρχειοθετεί ή ένα επαναρχειοθετεί προϊόντα με γνώμονα το δέντρο κατηγοριών το οποίο θα αναπτύξει για να κάνει την παρουσιάσει των προϊόντων στους χρήστες πιο εύκολη και αποτελεσματική. Θα έχει πρόσβαση σε όλα τα προϊόντα, χρήστες κριτικές, μηνύματα και δυνατότητα επεξεργασίας, απενεργοποίησης ή διαγραφής τους.

## Κατηγορίες

Δημιουργούνται από τον διαχειριστή ή μετά από αίτημα που γίνεται στον διαχειριστή από χρήστη και μπορούν να είναι κύριες ή υποκατηγορίες και σε αυτές μπορούν να αναρτηθούν από τους χρήστες προϊόντα. Οι κατηγορίες εκφράζονται από το όνομα τους, τον τίτλο τους, το βοηθητικό τους κείμενο (περιγραφή) και προαιρετικά από κάποια ενδεικτική φωτογραφία

## Προϊόντα

Τα προϊόντα αποτελούν εγγραφές που γίνονται από (εγγεγραμμένους) χρήστες και παρέχουν πληροφορίες για την ζήτηση ή την προσφορά ενός αγαθού. Η εγγραφές των προϊόντων εκφράζονται  από τον τίτλο, περιγραφή, ανάπτυξη, χαρακτηριστικά, όροι συναλλαγής, φωτογραφίες ,παραπομπές, την ημερομηνία αναρτήσεις και το επιθυμητό χρονικό όριο προβολής (εύρος ημερομηνιών).

## Κριτικές

Οι κριτικές είναι κείμενο το οποίο αναρτάτε από εγγεγραμμένους χρήστες (επώνυμα) και έχουν να κάνουν με κάποιο αναρτημένο προϊόν είναι μόνο πεζό κείμενο.

## Μηνύματα
	
Τα μηνύματα δημιουργούνται από χρήστης ή τον διαχειριστή και έχουν ως παραλήπτες άλλους χρήστες ή τον διαχειριστή. Είναι συνδεμένα άμεσα με τους χρήστες αλλά μπορεί να είναι συνδεμένα και με κάποιο προϊόν και αποτελούνται από κάποιο τίτλο και πεζό κείμενο.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details