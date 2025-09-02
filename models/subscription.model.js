import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription Name Is Required"],
        trim: true,
        minlength: [3, "Subscription Name Must Be At Least 3 Characters Long"],
        maxlength: [100, "Subscription Name Must Be At Most 100 Characters Long"]
    },
    price: {
        type: Number,
        required: [true, "Subscription Price Is Required"],
        min: [0, "Subscription Price Must Be At Least 0"]
    },
    currency: {
        type: String,
        required: [true, "Subscription Currency Is Required"],
        trim: true,
        enum: ["INR", "USD", "EUR"],
        default: "INR"
    },
    frequency: {
        type: String,
        enum: ["Daily", "Weekly", "Monthly", "Yearly"],
        default: "Monthly"
    },
    category: {
        type: String,
        required: true,
        enum: ["Health", "Fitness", "Food", "Travel", "Entertainment", "Others"],
        default: "Others"
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["Online", "Offline"],
        default: "Online"
    },
    status: {
        type: String,
        enum: ["Active", "Cancelled", "Expired"],
        default: "Active"
    },
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: (value) => value <= new Date(),
            message: "Start Date Must Be In The Past"
        }
    },
    renewalDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return value > this.startDate
            },
            message: "Renewal Date Must Be In The Future"
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, { timestamps: true });

//Auto-Calculate The Renewal Date
subscriptionSchema.pre('save', function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            "Daily": 1,
            "Weekly": 7,
            "Monthly": 30,
            "Yearly": 365
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.startDate.getDate() + renewalPeriods[this.frequency]);
    }

    if (this.renewalDate < new Date()) {
        this.status = "Expired";
    }

    next();
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;