package ru.base.controllers.nodes;


public class ContactNode {
    private int id;
    private String title;
    private Integer favorite;

    public ContactNode(int id, String title, Integer favorite) {
        this.id = id;
        this.title = title;
        this.favorite = favorite;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getFavorite() {return favorite;};
    public void  setFavorite(Integer favorite) {this.favorite = favorite;}
}
