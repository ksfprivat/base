package ru.base.controllers.items;


public class ContactListItem {
    private int id;
    private String title;
    private String position;
    private String customerTitle;

    public ContactListItem(int id, String title, String posiotion, String customerTitle) {
        this.id = id;
        this.title = title;
        this.position = posiotion;
        this.customerTitle = customerTitle;
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

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getCustomerTitle() {
        return customerTitle;
    }

    public void setCustomerTitle(String customerTitle) {
        this.customerTitle = customerTitle;
    }
}
