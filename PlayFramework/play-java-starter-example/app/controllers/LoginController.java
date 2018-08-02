package controllers;

import models.UserModel;
import play.data.Form;
import play.data.FormFactory;
import play.mvc.Controller;
import play.mvc.Result;
import views.html.*;

import javax.inject.Inject;

public class LoginController extends Controller {
	@Inject
	FormFactory formFactory;

	public Result loginIndex() {
		return ok(login.render());
	}

	public Result login(){

		String a = "Ddd";
		UserModel userModelForm = formFactory.form(UserModel.class).bindFromRequest().get();

		return ok("fgfdgfdg");
	}
}
