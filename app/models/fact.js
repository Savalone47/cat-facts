const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongooseDelete = require('mongoose-delete');
const random = require('mongoose-simple-random');

const FactSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    text: {type: String, required: true, unique: true},
    sendDate: {type: Date},
    used: {type: Boolean, default: false},
    source: {type: String, enum: ['user', 'api'], default: 'user'},
    type: {type: String, enum: ['cat', 'dog', 'snail', 'horse'], default: 'cat'}
}, {
    timestamps: true
});

/**
 * Soft delete implementation
 * https://github.com/dsanel/mongoose-delete
 */
FactSchema.plugin(mongooseDelete, {overrideMethods: true});
FactSchema.plugin(random);

FactSchema.statics.getFact = function ({amount = 1, filter = {}, animalType = 'cat'}) {
    
    if (typeof animalType === 'string') {
        animalType = [animalType];
    }
    
    const query = {
        ...filter,
        type: { $in: animalType }
    };
    
	return new Promise((resolve, reject) => {
		this.findRandom(query, {}, {limit: amount}, (err, facts) => {
			if (err) return reject(err);
			facts = facts || [];
			
			resolve(amount == 1 ? facts[0] : facts);
		});
	});
};

const Fact = mongoose.model('Fact', FactSchema);

module.exports = Fact;