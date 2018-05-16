package org.jason.framework.util;

import java.util.ArrayList;
import java.util.List;

public class ExtTreeNode {
	
	private String id;
	
	private String text;
	
	private Boolean leaf;
	
	private Boolean expanded;
	
	private String url;
	
	private String parentsId;
	
	private List<ExtTreeNode> children;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

	public Boolean getLeaf() {
		return leaf;
	}

	public void setLeaf(Boolean leaf) {
		this.leaf = leaf;
	}

	public Boolean getExpanded() {
		return expanded;
	}

	public void setExpanded(Boolean expanded) {
		this.expanded = expanded;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getParentsId() {
		return parentsId;
	}

	public void setParentsId(String parentsId) {
		this.parentsId = parentsId;
	}

	public List<ExtTreeNode> getChildren() {
		return children;
	}

	public void setChildren(List<ExtTreeNode> children) {
		this.children = children;
	}
	
	/**
	 * 增加子节点：可以手工使用Java代码构造树模型
	 */
	public void appendChild(ExtTreeNode treeNode) {
		if (getChildren() == null) {
			children = new ArrayList<ExtTreeNode>();
		}
		if (treeNode != null) {
			children.add(treeNode);
		}
	}
}

