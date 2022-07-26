"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.execute = exports.data = void 0;
const builders_1 = require("@discordjs/builders");
const Goal_js_1 = require("../../libs/Goal.js");
const crypto_1 = require("crypto");
exports.data = new builders_1.SlashCommandBuilder()
    .setName('set_goal')
    .setDescription('Crée un objectif')
    .addIntegerOption(opt => opt
    .setName('value')
    .setDescription('La valeur de l\'objectif')
    .setRequired(true)
    .setMinValue(0))
    .addStringOption(opt => opt
    .setName('unit')
    .setDescription('L\'unité de l\'objectif (par defaut: rank_points)')
    .setRequired(false)
    .addChoice('level', 'lvl')
    .addChoice('gold', 'gold')
    .addChoice('pv', 'pv')
    .addChoice('xp', 'xp')
    .addChoice('gems', 'gems')
    .addChoice('quest_missions', 'quest_missions_percentage')
    .addChoice('rank_points', 'rank_points'))
    .addStringOption(opt => opt
    .setName('duration')
    .setDescription('La durée de l\'objectif (par defaut: 1 semaine)')
    .setRequired(false)
    .addChoice('1 jour', '86400000')
    .addChoice('2 jours', '172800000')
    .addChoice('3 jours', '259200000')
    .addChoice('4 jours', '345600000')
    .addChoice('5 jours', '432000000')
    .addChoice('6 jours', '518400000')
    .addChoice('1 semaine', '604800000')
    .addChoice('2 semaines', '1209600000')
    .addChoice('3 semaines', '1814400000')
    .addChoice('1 mois', '2678400000'));
function execute(interaction, config, db, constants) {
    return __awaiter(this, void 0, void 0, function* () {
        yield interaction.deferReply();
        let opts = {
            value: interaction.options.getInteger('value'),
            unit: interaction.options.getString('unit') || 'rank_points',
            duration: interaction.options.getString('duration') || '604800000'
        };
        let user_hash = (0, crypto_1.createHash)('md5').update(interaction.user.id).digest('hex');
        if (!(yield db.getData(`/users`)).hasOwnProperty(user_hash)) {
            yield interaction.editReply(':warning: Veuillez activer le tracking du profil et enregistrer au moins une fois votre profil pour utiliser cette commande.');
            return;
        }
        let db_user = db.getData(`/users/${user_hash}`);
        if (db_user.tracking.filter(t => t.type === 'profile').length === 0) {
            yield interaction.editReply(':warning: Veuillez enregistrer au moins une fois votre profil pour utiliser cette commande.');
            return;
        }
        let init_value = db_user.tracking.filter(t => t.type === 'profile')[db_user.tracking.filter(t => t.type === 'profile').length - 1].data[opts.unit];
        yield new Goal_js_1.Goal(interaction.client, db, config, interaction.user.id, new Date(), new Date(new Date().getTime() + parseInt(opts.duration)), opts.value, opts.unit, init_value).save();
        yield interaction.editReply(':white_check_mark: Objectif créé avec succès.');
    });
}
exports.execute = execute;
