package models;

import javax.persistence.Entity;
import javax.persistence.Id;

import io.ebean.Model;
import play.data.validation.Constraints;

@Entity
public class UserModel extends Model{

	@Id
	public Integer id;
	public String userName;
	public String passWord;

}
