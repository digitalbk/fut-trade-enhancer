import { getValue } from "../services/repository";
import {
  idFutBinPrice,
  idBidBargain,
  idHideBinPop,
  idSaveSettingsBtn,
  idFutBinPercent,
  idBarginThreshold,
  idMinRating,
  idFutBinDuration,
  idOnlyBargain,
  idTransferFullPop,
} from "../app.constants";
import { generateToggleInput } from "../utils/uiUtils/generateToggleInput";
import { insertSettings } from "../utils/dbUtil";
import { generateButton } from "../utils/uiUtils/generateButton";
import { sendUINotification } from "../utils/notificationUtil";
import { generateTextInput } from "../utils/uiUtils/generateTextInput";
import { hideLoader, showLoader } from "../utils/commonUtil";
import { savePlayersWithInRatingRange } from "../utils/ratingFilterUtil";

export const EnhancerSettingsView = function (t) {
  UTView.call(this);
};

JSUtils.inherits(EnhancerSettingsView, UTView);

EnhancerSettingsView.prototype._generate = function _generate() {
  if (!this._generated) {
    let container = document.createElement("div");
    container.classList.add("ut-market-search-filters-view");
    container.classList.add("floating");
    container.style["overflow-y"] = "scroll";
    container.style["display"] = "flex";
    container.style["align-items"] = "center";
    let wrapper = document.createElement("div");
    wrapper.style["height"] = "100%";
    const enhancerSetting = getValue("EnhancerSettings") || {};
    let currentRating = enhancerSetting["idMinRating"];
    wrapper.appendChild(
      $(` <div class='enhancer-settings-wrapper ut-pinned-list'>
          <div class="enhancer-settings-header"> 
          <h1 class="secondary">Enhancer Settings</h1>
          </div>
          ${generateToggleInput(
            "Afficher le prix FutBin",
            { idFutBinPrice },
            "Affiche le prix Futbin et les bonnes affaires dans les recherches",
            "idFutBinPrice" in enhancerSetting
              ? enhancerSetting["idFutBinPrice"]
              : true
          )}
          ${generateToggleInput(
            "Marquer les offres d'enchères",
            { idBidBargain },
            "Bonnes affaires basées sur l'enchère actuelle",
            "idBidBargain" in enhancerSetting
              ? enhancerSetting["idBidBargain"]
              : false
          )}
          ${generateTextInput(
            "Pourcentage de seuil de bonnes affaires",
            95,
            { idBarginThreshold },
            "Mettez en surbrillance les articles si le prix est inférieur ou égal au pourcentage du prix FUTBIN",
            enhancerSetting["idBarginThreshold"]
          )}         
          ${generateTextInput(
            "Pourcentage de vente FUTBIN",
            95,
            { idFutBinPercent },
            "Pourcentage du prix de vente pour la remise en vente FUTBIN",
            enhancerSetting["idFutBinPercent"]
          )}
          ${generateTextInput(
            "Note",
            "",
            { idMinRating },
            "Affichera uniquement les joueurs avec cette note dans les recherches",
            enhancerSetting["idMinRating"],
            "text"
          )}
          ${generateTextInput(
            "Durée de la liste FUTBIN",
            "1H",
            { idFutBinDuration },
            "Durée de la liste lors du Re-list FUTBIN",
            enhancerSetting["idFutBinDuration"],
            "text"
          )}
          ${generateToggleInput(
            "Masquer la fenêtre de la corbeille",
            { idHideBinPop },
            "Confirme automatiquement la fenêtre Bin",
            "idHideBinPop" in enhancerSetting
              ? enhancerSetting["idHideBinPop"]
              : false
          )}
          ${generateToggleInput(
            "Masquer la fenêtre du transfert plein",
            { idTransferFullPop },
            "Masque la fenêtre de la liste transferts plein",
            "idTransferFullPop" in enhancerSetting
              ? enhancerSetting["idTransferFullPop"]
              : false
          )}
          ${generateToggleInput(
            "Afficher seulement les bonnes affaires",
            { idOnlyBargain },
            "Afficher uniquement les cartes inférieures à FUTBIN dans les recherches",
            "idOnlyBargain" in enhancerSetting
              ? enhancerSetting["idOnlyBargain"]
              : false
          )}
          <div class="enhancer-save-btn">
            ${generateButton(
              idSaveSettingsBtn,
              "Sauvegarder",
              async () => {
                showLoader();
                await insertSettings(
                  "enhancerSettings",
                  JSON.stringify(enhancerSetting)
                );
                if (currentRating !== enhancerSetting["idMinRating"]) {
                  await savePlayersWithInRatingRange(
                    enhancerSetting["idMinRating"]
                  );
                  currentRating = enhancerSetting["idMinRating"];
                }
                hideLoader();
                sendUINotification("Saved settings successfully");
              },
              "call-to-action flex-half"
            )}
          </div>
          </div>`)[0]
    );
    container.appendChild(wrapper);
    this.__root = container;
    this._generated = !0;
  }
};
