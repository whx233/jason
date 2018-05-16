package org.jason.framework.util;

import java.util.ArrayList;
import java.util.List;

/**
 * 菜单模型
 * @author whx233
 *
 */
public class TreeNode {

	private String id;

	private String cascadeId;

	private String menuName;

	private String parentsId;

	private Boolean isLeaf;

	private Boolean autoExpand;

	private String url;

	private String iconName;

	private Boolean isEnable;

	private int sortNum;

	private List<TreeNode> children;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getCascadeId() {
		return cascadeId;
	}

	public void setCascadeId(String cascadeId) {
		this.cascadeId = cascadeId;
	}

	public String getMenuName() {
		return menuName;
	}

	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}

	public String getParentsId() {
		return parentsId;
	}

	public void setParentsId(String parentsId) {
		this.parentsId = parentsId;
	}

	public Boolean getIsLeaf() {
		return isLeaf;
	}

	public void setIsLeaf(Boolean isLeaf) {
		this.isLeaf = isLeaf;
	}

	public Boolean getAutoExpand() {
		return autoExpand;
	}

	public void setAutoExpand(Boolean autoExpand) {
		this.autoExpand = autoExpand;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getIconName() {
		return iconName;
	}

	public void setIconName(String iconName) {
		this.iconName = iconName;
	}

	public Boolean getIsEnable() {
		return isEnable;
	}

	public void setIsEnable(Boolean isEnable) {
		this.isEnable = isEnable;
	}

	public int getSortNum() {
		return sortNum;
	}

	public void setSortNum(int sortNum) {
		this.sortNum = sortNum;
	}

	public List<TreeNode> getChildren() {
		return children;
	}

	public void setChildren(List<TreeNode> children) {
		this.children = children;
	}

	/**
	 * 增加子节点：可以手工使用Java代码构造树模型
	 */
	public void appendChild(TreeNode treeNode) {
		if (getChildren() == null) {
			children = new ArrayList<TreeNode>();
		}
		if (treeNode != null) {
			children.add(treeNode);
		}
	}

}
