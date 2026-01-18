# Pop-up Models - Dashboard Organizer

Ce document définit les modèles standards de pop-ups utilisés dans tout le Dashboard Organizer.

---

## 📐 STANDARDISATION DES DIMENSIONS

### Référence Officielle
**L'onglet Attendees est la référence unique pour toutes les dimensions.**

Toutes les pop-ups Success et Error dans l'ensemble du Dashboard Organizer doivent avoir **exactement les mêmes dimensions** que la pop-up Success de l'onglet Attendees.

### Objectif
Garantir une expérience utilisateur **cohérente, professionnelle et homogène**, en offrant un feedback visuel constant quelle que soit l'action effectuée ou l'onglet utilisé.

### Règles Absolues
- ✅ **Même largeur** : `max-w-md` (jamais max-w-sm, max-w-lg, etc.)
- ✅ **Même hauteur** : déterminée par `p-6` + `py-8` + contenu
- ✅ **Même structure visuelle** : overlay → container → padding → inner container → icône + message
- ✅ **Même alignement** : `flex items-center justify-center` pour tout
- ✅ **Même comportement** : affichage du message seul, sans ancien contenu
- ❌ **Aucune variation** de taille n'est autorisée selon la page ou le contexte

### Composants Standardisés
- ✅ AttendeesTable.tsx (référence)
- ✅ OrdersTable.tsx
- ✅ AccountSettingsOrganizer.tsx
- 🔄 Tous les futurs composants

---

## 1. Pop-up de Confirmation (Confirm Deletion)

### Structure
```tsx
{isDeleteConfirmOpen && itemToDelete && (
  <div 
    className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4" 
    onClick={() => !showDeleteSuccess && setIsDeleteConfirmOpen(false)}
  >
    <div 
      className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden" 
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        {!showDeleteSuccess ? (
          <>
            <h2 className="text-xl font-bold text-black mb-4">Confirm Deletion</h2>
            <p className="text-sm text-gray mb-6">
              Are you sure you want to delete <span className="font-semibold text-black">{itemToDelete.name}</span> ?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  setItemToDelete(null);
                }}
                className="px-5 py-2 border border-primary text-primary rounded-full text-sm font-medium hover:bg-primary-light transition-all whitespace-nowrap cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log('Deleting item:', itemToDelete.id);
                  setShowDeleteSuccess(true);
                  setTimeout(() => {
                    setShowDeleteSuccess(false);
                    setIsDeleteConfirmOpen(false);
                    setItemToDelete(null);
                  }, 3000);
                }}
                className="px-5 py-2 bg-[#FF4000] hover:bg-[#E63900] text-white font-medium text-sm rounded-full transition-all whitespace-nowrap cursor-pointer"
                style={{ boxShadow: '0 4px 12px rgba(255, 64, 0, 0.25)' }}
              >
                Confirm
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <img src={SuccessIcon} alt="Success" className="w-16 h-16 mb-4" style={{ filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)' }} />
            <p className="text-lg font-semibold text-black">Item successfully deleted</p>
          </div>
        )}
      </div>
    </div>
  </div>
)}
```

### Caractéristiques
- **Largeur** : `max-w-md`
- **Titre** : "Confirm Deletion" (text-xl font-bold)
- **Message** : Texte explicatif avec nom de l'élément en gras
- **Boutons** : Cancel (secondary) + Confirm (primary)
- **Durée du succès** : 3 secondes

---

## 2. Pop-up de Validation (Success)

### ⚠️ RÉFÉRENCE OFFICIELLE
**La taille de référence est celle de l'onglet Attendees.**
Toutes les pop-ups Success et Error doivent utiliser exactement ces dimensions.

### Structure
```tsx
{showSuccess && (
  <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <img 
            src={SuccessIcon} 
            alt="Success" 
            className="w-16 h-16 mb-4" 
            style={{ filter: 'invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)' }} 
          />
          <p className="text-lg font-semibold text-black">Action completed successfully</p>
        </div>
      </div>
    </div>
  </div>
)}
```

### Caractéristiques STANDARDISÉES
- **Overlay** : `fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4`
- **Container** : `bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden`
- **Outer padding** : `p-6`
- **Inner container** : `flex flex-col items-center justify-center py-8`
- **Icône** : `w-16 h-16 mb-4` avec filtre CSS vert
- **Message** : `text-lg font-semibold text-black`
- **Contenu** : Uniquement icône + message (pas de bouton)
- **Fermeture** : Automatique après 3 secondes

### 🚨 RÈGLES STRICTES
- ✅ Toujours utiliser `max-w-md` (jamais max-w-sm, max-w-lg, etc.)
- ✅ Toujours utiliser `p-6` pour l'outer padding
- ✅ Toujours utiliser `py-8` pour l'inner container
- ✅ Toujours utiliser `w-16 h-16 mb-4` pour l'icône
- ✅ Toujours utiliser `text-lg font-semibold text-black` pour le message
- ❌ Aucune variation de taille n'est autorisée

### Exemples de messages
- "Attendee successfully deleted"
- "Order successfully deleted"
- "Role successfully deleted"
- "Member successfully removed"
- "Ticket resent successfully"
- "Changes saved successfully"

---

## 3. Pop-up d'Échec (Error)

### ⚠️ DIMENSIONS STRICTEMENT IDENTIQUES À SUCCESS
**Toutes les dimensions doivent être exactement les mêmes que la pop-up Success.**
Seule l'icône change (rouge au lieu de verte).

### Structure
```tsx
{showError && (
  <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
      <div className="p-6">
        <div className="flex flex-col items-center justify-center py-8">
          <img 
            src={ErrorIcon} 
            alt="Error" 
            className="w-16 h-16 mb-4"
          />
          <p className="text-lg font-semibold text-black">Action failed. Please try again</p>
        </div>
      </div>
    </div>
  </div>
)}
```

### Caractéristiques STANDARDISÉES (identiques à Success)
- **Overlay** : `fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4`
- **Container** : `bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden`
- **Outer padding** : `p-6`
- **Inner container** : `flex flex-col items-center justify-center py-8`
- **Icône** : `w-16 h-16 mb-4` (rouge, sans filtre CSS)
- **Message** : `text-lg font-semibold text-black`
- **Contenu** : Uniquement icône + message (pas de bouton)
- **Fermeture** : Automatique après 3 secondes

### 🚨 RÈGLES STRICTES (identiques à Success)
- ✅ Toujours utiliser `max-w-md` (jamais max-w-sm, max-w-lg, etc.)
- ✅ Toujours utiliser `p-6` pour l'outer padding
- ✅ Toujours utiliser `py-8` pour l'inner container
- ✅ Toujours utiliser `w-16 h-16 mb-4` pour l'icône
- ✅ Toujours utiliser `text-lg font-semibold text-black` pour le message
- ❌ Aucune variation de taille n'est autorisée

### Exemples de messages
- "Action failed. Please try again."
- "Failed to delete item. Please try again."
- "Failed to send invitation. Please try again."
- "Failed to resend ticket. Please try again."
- "Failed to save changes. Please try again."

### Icône Error
Fichier : `src/assets/Svgs/error.svg`
- Cercle rouge (#EF4444)
- Icône d'alerte (!) en blanc
- Dimensions : 64x64

---

## 4. Implémentation Type

### States nécessaires
```tsx
const [showSuccess, setShowSuccess] = useState(false);
const [showError, setShowError] = useState(false);
```

### Fonction de succès
```tsx
const handleSuccess = () => {
  setShowSuccess(true);
  setTimeout(() => {
    setShowSuccess(false);
    // Redirection ou fermeture de modal
  }, 3000);
};
```

### Fonction d'échec
```tsx
const handleError = () => {
  setShowError(true);
  setTimeout(() => {
    setShowError(false);
  }, 3000);
};
```

### Exemple avec API call
```tsx
const handleAction = async () => {
  try {
    await apiCall();
    handleSuccess();
  } catch (error) {
    handleError();
  }
};
```

---

## 5. Règles d'utilisation

### ✅ À faire
- Utiliser exactement les mêmes dimensions pour Success et Error
- Garder la même structure (icône + message centré)
- Fermeture automatique après 3 secondes
- Messages clairs et concis en anglais
- Pas de bouton dans les pop-ups de validation/échec

### ❌ À ne pas faire
- Ne pas modifier les dimensions ou le padding
- Ne pas ajouter de boutons dans Success/Error
- Ne pas changer la durée de fermeture automatique
- Ne pas mélanger les styles entre les pages
- Ne pas oublier le filtre CSS pour l'icône de succès

---

## 6. Cas d'utilisation

### Pop-up de Confirmation
- Suppression d'attendee
- Suppression d'order
- Suppression de rôle
- Retrait de membre d'équipe
- Toute action critique irréversible

### Pop-up de Validation (Success)
- Après confirmation d'une suppression
- Après envoi d'invitation
- Après renvoi de ticket
- Après sauvegarde de modifications
- Toute action réussie

### Pop-up d'Échec (Error)
- Échec de suppression
- Échec d'envoi d'invitation
- Échec de renvoi de ticket
- Échec de sauvegarde
- Toute erreur backend

---

## 7. Imports nécessaires

```tsx
import SuccessIcon from '../../assets/Svgs/success.svg';
import ErrorIcon from '../../assets/Svgs/error.svg';
```

---

## 8. Cohérence UI

Ces modèles sont utilisés dans :
- ✅ AttendeesTable.tsx
- ✅ OrdersTable.tsx
- ✅ AccountSettingsOrganizer.tsx (Team & Roles)
- 🔄 EventsTable.tsx (à implémenter si nécessaire)
- 🔄 Autres composants futurs

**Objectif** : Garantir une expérience utilisateur uniforme et prévisible dans tout le Dashboard Organizer.
