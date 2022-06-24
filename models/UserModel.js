import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    uname: {
      type: String,
      default: "",
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    resetToken: {
      type: String,
      required: false,
    },
    expireToken: {
      type: String,
      required: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
    isSignedIn: {
      type: Boolean,
      default: false,
    },
    passwordSaved: {
      type: Boolean,
      default: false,
    },
    showFullName: {
      type: Boolean,
      default: true,
    },
    showEmail: {
      type: Boolean,
      default: false,
    },
    blockedUsers: [
      {
        type: String,
        unique: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.withoutPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
